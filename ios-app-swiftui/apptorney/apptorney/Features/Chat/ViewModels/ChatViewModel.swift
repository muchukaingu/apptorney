import Foundation

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var threads: [ChatThread] = []
    @Published var currentThreadId: String?
    @Published var inputText: String = ""
    @Published var isStreaming: Bool = false
    @Published var snackbar: SnackbarMessage?

    private var streamTask: Task<Void, Never>?

    // MARK: - Send Message

    func sendMessage() {
        let question = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !question.isEmpty, !isStreaming else { return }

        inputText = ""
        messages.append(ChatMessage(text: question, isUser: true))
        messages.append(ChatMessage(text: "", isUser: false))
        isStreaming = true

        streamTask = Task {
            await streamResponse(question: question)
        }
    }

    // MARK: - Stream Response

    func streamResponse(question: String) async {
        do {
            let accessToken = KeychainService.load(key: "accessToken")
            let endpoint = Endpoint.askAI(
                question: question,
                threadId: currentThreadId,
                accessToken: accessToken
            )
            let bytes = try await APIClient.shared.streamRequest(endpoint)

            var buffer = ""
            for try await byte in bytes {
                let char = Character(UnicodeScalar(byte))
                buffer.append(char)

                // Process complete SSE blocks (separated by double newline)
                while let range = buffer.range(of: "\n\n") {
                    let block = String(buffer[buffer.startIndex..<range.lowerBound])
                    buffer = String(buffer[range.upperBound...])

                    if block.trimmingCharacters(in: .whitespacesAndNewlines) == "[DONE]" {
                        isStreaming = false
                        return
                    }

                    if !block.isEmpty {
                        processSSEEvent(block)
                    }
                }
            }
            isStreaming = false
        } catch {
            isStreaming = false
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    // MARK: - Parse SSE Events

    func processSSEEvent(_ block: String) {
        var eventType: String?
        var dataString: String?

        for line in block.components(separatedBy: "\n") {
            if line.hasPrefix("event:") {
                eventType = line.replacingOccurrences(of: "event:", with: "").trimmingCharacters(in: .whitespaces)
            } else if line.hasPrefix("data:") {
                dataString = line.replacingOccurrences(of: "data:", with: "").trimmingCharacters(in: .whitespaces)
            }
        }

        guard let type = eventType, let jsonString = dataString,
              let jsonData = jsonString.data(using: .utf8) else { return }

        switch type {
        case "token":
            if let parsed = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
               let text = parsed["text"] as? String {
                appendToLastAssistant(text)
            }

        case "metadata":
            if let parsed = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
               let sources = parsed["sources"] as? [[String: Any]] {
                let refs = sources.compactMap { src -> ChatReference? in
                    guard let source = src["source"] as? String,
                          let id = src["id"] as? String,
                          let type = src["type"] as? String,
                          let title = src["title"] as? String else { return nil }
                    return ChatReference(source: source, sourceId: id, type: type, title: title)
                }
                if !refs.isEmpty, !messages.isEmpty {
                    messages[messages.count - 1].references = refs
                }
            }

        case "done":
            if let parsed = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
               let thread = parsed["thread"] as? [String: Any],
               let threadId = thread["id"] as? String {
                currentThreadId = threadId
            }

        case "error":
            if let parsed = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any],
               let message = parsed["message"] as? String {
                snackbar = SnackbarMessage(text: message)
            }

        default:
            break
        }
    }

    // MARK: - Helpers

    func appendToLastAssistant(_ text: String) {
        guard !messages.isEmpty else { return }
        messages[messages.count - 1].text += text
    }

    func loadThreads() async {
        do {
            let response: ChatThreadsResponse = try await APIClient.shared.request(.chatThreads())
            threads = response.threads ?? []
        } catch {
            snackbar = SnackbarMessage(text: "Failed to load chat history")
        }
    }

    func startNewThread() {
        currentThreadId = nil
        messages = []
    }

    func cancelStream() {
        streamTask?.cancel()
        streamTask = nil
        isStreaming = false
    }
}
