import SwiftUI

// MARK: - Main View

struct MainView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var isMenuOpen = false
    @State private var selectedDestination: MenuDestination = .home
    @StateObject private var chatViewModel = ChatViewModel()

    var body: some View {
        SideMenuContainer(isOpen: $isMenuOpen) {
            SideMenuView(
                selectedDestination: $selectedDestination,
                isMenuOpen: $isMenuOpen,
                chatViewModel: chatViewModel
            )
        } content: {
            NavigationStack {
                contentView
                    .toolbar {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button(action: {
                                withAnimation { isMenuOpen.toggle() }
                            }) {
                                Image(systemName: "line.3.horizontal")
                                    .foregroundColor(.primary)
                            }
                        }
                        if selectedDestination == .home {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    chatViewModel.startNewThread(firstName: authManager.currentUser?.firstName)
                                }) {
                                    Image(systemName: "square.and.pencil")
                                        .foregroundColor(.primary)
                                }
                            }
                        }
                    }
                    .navigationTitle(selectedDestination.title)
                    .navigationBarTitleDisplayMode(.inline)
            }
        }
    }

    @ViewBuilder
    private var contentView: some View {
        switch selectedDestination {
        case .home:
            ChatView(viewModel: chatViewModel)
        case .cases:
            CasesListView()
        case .legislations:
            LegislationsListView()
        case .bookmarks:
            BookmarksView()
        case .settings:
            SettingsView()
        }
    }
}
