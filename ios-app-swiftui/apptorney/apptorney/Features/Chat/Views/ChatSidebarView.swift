import SwiftUI

struct ChatSidebarView: View {
    @ObservedObject var viewModel: ChatViewModel
    @Binding var showSidebar: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Text("Chat History")
                    .font(.headline)
                Spacer()
                Button(action: {
                    viewModel.startNewThread()
                    withAnimation { showSidebar = false }
                }) {
                    Image(systemName: "plus.circle")
                        .font(.title3)
                        .foregroundColor(.appBlue)
                }
            }
            .padding()

            Divider()

            // Thread list
            if viewModel.threads.isEmpty {
                VStack {
                    Spacer()
                    Text("No conversations yet")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                .frame(maxWidth: .infinity)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(viewModel.threads) { thread in
                            Button(action: {
                                viewModel.currentThreadId = thread.id
                                viewModel.messages = []
                                withAnimation { showSidebar = false }
                            }) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(thread.title ?? "Untitled")
                                        .font(.subheadline.weight(.medium))
                                        .foregroundColor(.primary)
                                        .lineLimit(1)

                                    if let question = thread.lastQuestion {
                                        Text(question)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                            .lineLimit(2)
                                    }
                                }
                                .padding(.horizontal)
                                .padding(.vertical, 10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(
                                    viewModel.currentThreadId == thread.id
                                        ? Color.appBlue.opacity(0.1)
                                        : Color.clear
                                )
                            }

                            Divider().padding(.leading)
                        }
                    }
                }
            }
        }
    }
}
