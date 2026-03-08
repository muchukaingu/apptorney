import SwiftUI

struct ChatSidebarView: View {
    @ObservedObject var viewModel: ChatViewModel
    @Binding var showSidebar: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header with menu + new chat
            HStack {
                Button(action: {
                    withAnimation { showSidebar = false }
                }) {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 24))
                        .foregroundColor(.primary)
                }

                Spacer()

                Button(action: {
                    viewModel.startNewThread()
                    withAnimation { showSidebar = false }
                }) {
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 20))
                        .foregroundColor(.primary)
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 14)

            Divider()

            // Thread list
            if viewModel.threads.isEmpty {
                VStack {
                    Spacer()
                    Text("No conversations yet")
                        .font(.system(size: 15))
                        .foregroundColor(Color(white: 0.42))
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
                                Text(thread.title ?? thread.lastQuestion ?? "Untitled")
                                    .font(.system(size: 15))
                                    .foregroundColor(.primary)
                                    .lineLimit(1)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.vertical, 8)
                                    .padding(.horizontal, 18)
                                    .background(
                                        RoundedRectangle(cornerRadius: 10)
                                            .fill(viewModel.currentThreadId == thread.id
                                                  ? Color.black.opacity(0.08)
                                                  : Color.clear)
                                            .padding(.horizontal, 8)
                                    )
                            }
                        }
                    }
                    .padding(.top, 8)
                }
            }
        }
    }
}
