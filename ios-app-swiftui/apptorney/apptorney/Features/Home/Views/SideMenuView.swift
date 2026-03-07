import SwiftUI

enum MenuDestination: String, CaseIterable, Identifiable {
    case home
    case cases
    case legislations
    case search
    case settings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .home: return "Home"
        case .cases: return "Cases"
        case .legislations: return "Legislations"
        case .search: return "Search"
        case .settings: return "Settings"
        }
    }

    var icon: String {
        switch self {
        case .home: return "house"
        case .cases: return "book.closed"
        case .legislations: return "doc.text"
        case .search: return "magnifyingglass"
        case .settings: return "gearshape"
        }
    }
}

struct SideMenuView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState
    @Binding var selectedDestination: MenuDestination
    @Binding var isMenuOpen: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Profile header
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: "person.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(.appBlue)

                Text(authManager.currentUser?.fullName ?? "User")
                    .font(.headline)

                Text(authManager.currentUser?.email ?? "")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding(24)

            Divider()

            // Menu items
            ForEach(MenuDestination.allCases) { destination in
                Button(action: {
                    selectedDestination = destination
                    withAnimation { isMenuOpen = false }
                }) {
                    HStack(spacing: 16) {
                        Image(systemName: destination.icon)
                            .frame(width: 24)
                        Text(destination.title)
                            .font(.body)
                        Spacer()
                    }
                    .foregroundColor(selectedDestination == destination ? .appBlue : .primary)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 14)
                    .background(selectedDestination == destination ? Color.appBlue.opacity(0.1) : Color.clear)
                }
            }

            Spacer()

            Divider()

            // Log out
            Button(action: {
                authManager.clearSession()
                appState.currentFlow = .auth
            }) {
                HStack(spacing: 16) {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .frame(width: 24)
                    Text("Log Out")
                        .font(.body)
                    Spacer()
                }
                .foregroundColor(.appRed)
                .padding(.horizontal, 24)
                .padding(.vertical, 14)
            }
            .padding(.bottom, 16)
        }
        .background(Color(.systemBackground))
    }
}
