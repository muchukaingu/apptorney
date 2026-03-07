import SwiftUI

// MARK: - Main View

struct MainView: View {
    @State private var isMenuOpen = false
    @State private var selectedDestination: MenuDestination = .home

    var body: some View {
        SideMenuContainer(isOpen: $isMenuOpen) {
            SideMenuView(selectedDestination: $selectedDestination, isMenuOpen: $isMenuOpen)
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
            HomeView()
        case .cases:
            CasesListView()
        case .legislations:
            LegislationsListView()
        case .search:
            GlobalSearchView()
        case .settings:
            SettingsView()
        }
    }
}
