import SwiftUI

enum MenuDestination: String, Identifiable {
    case home
    case cases
    case legislations
    case bookmarks
    case settings

    var id: String { rawValue }

    static let menuItems: [MenuDestination] = [.home, .cases, .legislations, .bookmarks]

    var title: String {
        switch self {
        case .home: return "Apptorney AI"
        case .cases: return "Cases"
        case .legislations: return "Legislations"
        case .bookmarks: return "Bookmarks"
        case .settings: return "Settings"
        }
    }

    var menuLabel: String {
        switch self {
        case .home: return "Home"
        default: return title
        }
    }

    var icon: String {
        switch self {
        case .home: return "home-tab"
        case .cases: return "cases-tab-fat"
        case .legislations: return "legislations-tab-fat"
        case .bookmarks: return ""
        case .settings: return "settings-tab-fat"
        }
    }

    var systemIcon: String {
        switch self {
        case .home: return "house"
        case .cases: return "book.closed"
        case .legislations: return "doc.text"
        case .bookmarks: return "bookmark"
        case .settings: return "gearshape"
        }
    }
}

struct SideMenuView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState
    @Binding var selectedDestination: MenuDestination
    @Binding var isMenuOpen: Bool
    @ObservedObject var chatViewModel: ChatViewModel

    private var initials: String {
        let first = authManager.currentUser?.firstName?.prefix(1) ?? ""
        let last = authManager.currentUser?.lastName?.prefix(1) ?? ""
        let result = "\(first)\(last)"
        return result.isEmpty ? "?" : result.uppercased()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header: menu close + new chat
            HStack {
                Button(action: {
                    withAnimation { isMenuOpen = false }
                }) {
                    Image(systemName: "line.3.horizontal")
                        .foregroundColor(.primary)
                }

                Spacer()

                Button(action: {
                    chatViewModel.startNewThread(firstName: authManager.currentUser?.firstName)
                    selectedDestination = .home
                    withAnimation { isMenuOpen = false }
                }) {
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 20))
                        .foregroundColor(.primary)
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 14)

            // Navigation items
            ForEach(MenuDestination.menuItems) { destination in
                Button(action: {
                    selectedDestination = destination
                    withAnimation { isMenuOpen = false }
                }) {
                    HStack(spacing: 16) {
                        Group {
                            if destination.icon.isEmpty {
                                Image(systemName: destination.systemIcon)
                                    .resizable()
                                    .scaledToFit()
                            } else {
                                Image(destination.icon)
                                    .renderingMode(.template)
                                    .resizable()
                                    .scaledToFit()
                            }
                        }
                        .frame(width: 22, height: 22)
                        Text(destination.menuLabel)
                            .font(.system(size: 15))
                        Spacer()
                    }
                    .foregroundColor(.primary)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(selectedDestination == destination ? Color.black.opacity(0.08) : Color.clear)
                    )
                    .padding(.horizontal, 8)
                }
            }

            // Conversations section
            if !chatViewModel.threads.isEmpty {
                VStack(alignment: .leading, spacing: 0) {
                    Text("Conversations")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(white: 0.45))
                        .textCase(.uppercase)
                        .tracking(0.5)
                        .padding(.horizontal, 24)
                        .padding(.top, 16)
                        .padding(.bottom, 8)

                    ScrollView(showsIndicators: false) {
                        LazyVStack(alignment: .leading, spacing: 0) {
                            ForEach(chatViewModel.threads) { thread in
                                Button(action: {
                                    chatViewModel.currentThreadId = thread.id
                                    chatViewModel.messages = []
                                    selectedDestination = .home
                                    withAnimation { isMenuOpen = false }
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
                                                .fill(chatViewModel.currentThreadId == thread.id
                                                      ? Color.black.opacity(0.08)
                                                      : Color.clear)
                                                .padding(.horizontal, 8)
                                        )
                                }
                            }
                        }
                    }
                }
            }

            Spacer()

            Divider()

            // User profile → opens settings
            Button(action: {
                selectedDestination = .settings
                withAnimation { isMenuOpen = false }
            }) {
                HStack(spacing: 12) {
                    Text(initials)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(width: 40, height: 40)
                        .background(Color.black)
                        .clipShape(Circle())

                    VStack(alignment: .leading, spacing: 2) {
                        Text(authManager.currentUser?.fullName ?? "User")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(.primary)
                            .lineLimit(1)

                        Text(authManager.currentUser?.email ?? "")
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }

                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
            .padding(.bottom, 8)
        }
        .background(Color(white: 0.96))
    }
}
