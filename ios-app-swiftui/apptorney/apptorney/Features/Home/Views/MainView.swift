import SwiftUI

// MARK: - Placeholder Stubs

struct HomeView: View {
    var body: some View {
        Text("Home")
            .font(.title)
            .foregroundColor(.secondary)
    }
}

struct CasesListView: View {
    var body: some View {
        Text("Cases")
            .font(.title)
            .foregroundColor(.secondary)
    }
}

struct LegislationsListView: View {
    var body: some View {
        Text("Legislations")
            .font(.title)
            .foregroundColor(.secondary)
    }
}

struct GlobalSearchView: View {
    var body: some View {
        Text("Search")
            .font(.title)
            .foregroundColor(.secondary)
    }
}

struct SettingsView: View {
    var body: some View {
        Text("Settings")
            .font(.title)
            .foregroundColor(.secondary)
    }
}

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
