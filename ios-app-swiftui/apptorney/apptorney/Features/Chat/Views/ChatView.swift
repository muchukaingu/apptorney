import SwiftUI

struct ChatView: View {
    @EnvironmentObject var authManager: AuthManager
    @ObservedObject var viewModel: ChatViewModel

    var body: some View {
        VStack(spacing: 0) {
            if viewModel.messages.isEmpty || isOnlyInitialMessage {
                // Greeting centered on screen
                Spacer()
                initialStateView
                Spacer()
            } else {
                // Messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 8) {
                            ForEach(viewModel.messages) { message in
                                ChatMessageView(
                                    message: message,
                                    isStreaming: viewModel.isStreaming && message.id == viewModel.messages.last?.id
                                )
                                .id(message.id)
                            }

                            if viewModel.isStreaming && (viewModel.messages.last?.text.isEmpty ?? false) {
                                TypingIndicator()
                                    .padding(.leading, 16)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                        .padding(.top, 18)
                        .padding(.bottom, 80)
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        scrollToBottom(proxy)
                    }
                    .onChange(of: viewModel.messages.last?.text) { _ in
                        scrollToBottom(proxy)
                    }
                }
            }

            // Input bar
            ChatInputBar(
                text: $viewModel.inputText,
                isStreaming: viewModel.isStreaming,
                onSend: { viewModel.sendMessage() }
            )
        }
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.loadThreads(firstName: authManager.currentUser?.firstName)
        }
    }

    private var isOnlyInitialMessage: Bool {
        viewModel.messages.count == 1 && !viewModel.messages[0].isUser && viewModel.messages[0].text.isEmpty
    }

    private var initialStateView: some View {
        Text(viewModel.greeting)
            .font(.system(size: 20, weight: .light))
            .foregroundColor(Color(white: 0.35))
            .multilineTextAlignment(.center)
            .padding(.horizontal, 32)
    }

    private func scrollToBottom(_ proxy: ScrollViewProxy) {
        if let last = viewModel.messages.last {
            withAnimation(.easeOut(duration: 0.15)) {
                proxy.scrollTo(last.id, anchor: .bottom)
            }
        }
    }
}

// MARK: - Input Bar

struct ChatInputBar: View {
    @Binding var text: String
    let isStreaming: Bool
    let onSend: () -> Void

    var body: some View {
        HStack(alignment: .center, spacing: 10) {
            TextField("Ask anything", text: $text, axis: .vertical)
                .font(.system(size: 17))
                .lineLimit(1...5)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .disabled(isStreaming)
                .onSubmit { onSend() }

            Button(action: onSend) {
                Image(systemName: "arrow.up")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 36, height: 36)
                    .background(canSend ? Color.black : Color.gray.opacity(0.4))
                    .clipShape(Circle())
            }
            .disabled(!canSend)
            .padding(.trailing, 6)
        }
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(Color(white: 0.85), lineWidth: 0.5)
                )
        )
        .padding(.horizontal, 16)
        .padding(.bottom, 10)
    }

    private var canSend: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isStreaming
    }
}

// MARK: - Typing Indicator

struct TypingIndicator: View {
    @State private var activeDot = 0
    let timer = Timer.publish(every: 0.3, on: .main, in: .common).autoconnect()

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(index == activeDot ? Color(white: 0.58) : Color(white: 0.75))
                    .frame(width: 8, height: 8)
            }
        }
        .padding(.vertical, 8)
        .onReceive(timer) { _ in
            activeDot = (activeDot + 1) % 3
        }
    }
}
