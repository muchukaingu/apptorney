import Foundation
import os.log

private let logger = Logger(subsystem: "com.apptorney.swiftui", category: "chat")

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var threads: [ChatThread] = []
    @Published var currentThreadId: String?
    @Published var inputText: String = ""
    @Published var isStreaming: Bool = false
    @Published var snackbar: SnackbarMessage?
    @Published var greeting: String = ""

    private var streamTask: Task<Void, Never>?

    // MARK: - Greeting

    func generateGreeting(firstName: String?) {
        let name = firstName ?? "there"
        let hour = Calendar.current.component(.hour, from: Date())
        let timeGreeting: String
        if hour < 12 {
            timeGreeting = "Good morning"
        } else if hour < 17 {
            timeGreeting = "Good afternoon"
        } else {
            timeGreeting = "Good evening"
        }

        // If there's a recent conversation, reference it
        if let recentThread = threads.first,
           let topic = recentThread.title ?? recentThread.lastQuestion {
            let contextGreetings = [
                "Hello \(name), want to pick up where you left off on \"\(topic)\"?",
                "\(timeGreeting) \(name). Continue researching \"\(topic)\"?",
                "Welcome back \(name). Shall we revisit \"\(topic)\"?",
                "Hi \(name), ready to dive back into \"\(topic)\"?"
            ]
            greeting = contextGreetings.randomElement()!
        } else {
            let genericGreetings = [
                "Hello \(name), how can I help you today?",
                "\(timeGreeting) \(name). What would you like to research?",
                "Hi \(name), ask me anything about Zambian law.",
                "Hello \(name), what legal question can I help with?",
                "\(timeGreeting) \(name), ready to get started?"
            ]
            greeting = genericGreetings.randomElement()!
        }
    }

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

            var rawBuffer = Data()
            for try await byte in bytes {
                rawBuffer.append(byte)

                // Try to decode as UTF-8; skip if incomplete multi-byte sequence
                guard let text = String(data: rawBuffer, encoding: .utf8) else { continue }

                // Only process when we have a complete SSE block (double newline)
                guard text.contains("\n\n") else { continue }

                // Process complete SSE blocks
                var remaining = text
                while let range = remaining.range(of: "\n\n") {
                    let block = String(remaining[remaining.startIndex..<range.lowerBound])
                    remaining = String(remaining[range.upperBound...])

                    if block.trimmingCharacters(in: .whitespacesAndNewlines) == "[DONE]" {
                        isStreaming = false
                        return
                    }

                    if !block.isEmpty {
                        processSSEEvent(block)
                    }
                }

                rawBuffer = remaining.data(using: .utf8) ?? Data()
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
                    let refSummary = refs.map { "\($0.source) - \($0.title)" }.joined(separator: ", ")
                    let msgTail = String(self.messages[self.messages.count - 1].text.suffix(300))
                    logger.notice("REFS: \(refSummary)")
                    logger.notice("MSG_TAIL: \(msgTail)")
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
        // Debug: log when source tags appear
        if text.contains("[") {
            logger.notice("TOKEN_BRACKET: \(text)")
        }
    }

    func loadThreads(firstName: String? = nil) async {
        do {
            let response: ChatThreadsResponse = try await APIClient.shared.request(.chatThreads())
            threads = response.threads ?? []
        } catch {
            snackbar = SnackbarMessage(text: "Failed to load chat history")
        }
        generateGreeting(firstName: firstName)
    }

    func startNewThread(firstName: String? = nil) {
        currentThreadId = nil
        messages = []
        generateGreeting(firstName: firstName)
    }

    func cancelStream() {
        streamTask?.cancel()
        streamTask = nil
        isStreaming = false
    }
}
