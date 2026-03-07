import SwiftUI

struct ChatView: View {
    @StateObject private var viewModel = ChatViewModel()
    @State private var showSidebar = false

    var body: some View {
        ZStack(alignment: .leading) {
            VStack(spacing: 0) {
                // Messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                ChatMessageView(message: message)
                                    .id(message.id)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        if let last = viewModel.messages.last {
                            withAnimation {
                                proxy.scrollTo(last.id, anchor: .bottom)
                            }
                        }
                    }
                    .onChange(of: viewModel.messages.last?.text) { _ in
                        if let last = viewModel.messages.last {
                            proxy.scrollTo(last.id, anchor: .bottom)
                        }
                    }
                }

                Divider()

                // Input bar
                HStack(spacing: 12) {
                    TextField("Ask a legal question...", text: $viewModel.inputText)
                        .textFieldStyle(.roundedBorder)
                        .disabled(viewModel.isStreaming)
                        .onSubmit {
                            viewModel.sendMessage()
                        }

                    Button(action: { viewModel.sendMessage() }) {
                        Image(systemName: viewModel.isStreaming ? "stop.circle.fill" : "paperplane.fill")
                            .font(.title3)
                            .foregroundColor(.appBlue)
                    }
                    .disabled(viewModel.inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !viewModel.isStreaming)
                }
                .padding(.horizontal)
                .padding(.vertical, 10)
            }

            // Sidebar overlay
            if showSidebar {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation { showSidebar = false }
                    }

                ChatSidebarView(viewModel: viewModel, showSidebar: $showSidebar)
                    .frame(width: 280)
                    .background(Color(.systemBackground))
                    .transition(.move(edge: .leading))
            }
        }
        .animation(.easeInOut(duration: 0.25), value: showSidebar)
        .navigationTitle("Ask AI")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    withAnimation { showSidebar.toggle() }
                }) {
                    Image(systemName: "sidebar.left")
                        .foregroundColor(.appBlue)
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    viewModel.startNewThread()
                }) {
                    Image(systemName: "plus")
                        .foregroundColor(.appBlue)
                }
            }
        }
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.loadThreads()
        }
    }
}
