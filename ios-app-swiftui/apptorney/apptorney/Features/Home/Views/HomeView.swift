import SwiftUI

struct HomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 24) {
                // Welcome header
                VStack(alignment: .leading, spacing: 4) {
                    Text("Welcome, \(authManager.currentUser?.firstName ?? "User")")
                        .font(.title2.bold())

                    Text(Date(), format: .dateTime.weekday(.wide).month(.wide).day())
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)

                if viewModel.isLoading {
                    shimmerSection
                } else {
                    homeSection(title: "MY BOOKMARKS", items: viewModel.bookmarks)
                    homeSection(title: "WHAT'S NEW", items: viewModel.news)
                    homeSection(title: "TRENDING", items: viewModel.trends)
                }
            }
            .padding(.vertical)
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    ChatView()
                } label: {
                    Image(systemName: "bubble.left.and.bubble.right")
                        .foregroundColor(.appBlue)
                }
            }
        }
        .snackbar(message: $viewModel.snackbar)
        .task {
            let username = authManager.currentUser?.email ?? ""
            await viewModel.loadAll(username: username)
        }
    }

    // MARK: - Sections

    @ViewBuilder
    private func homeSection(title: String, items: [HomeItem]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .padding(.horizontal)

            if items.isEmpty {
                Text("No items yet")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(spacing: 12) {
                        ForEach(items) { item in
                            HomeCardView(item: item)
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
    }

    private var shimmerSection: some View {
        VStack(alignment: .leading, spacing: 24) {
            ForEach(0..<3, id: \.self) { _ in
                VStack(alignment: .leading, spacing: 8) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(.systemGray5))
                        .frame(width: 120, height: 14)
                        .padding(.horizontal)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(0..<3, id: \.self) { _ in
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color(.systemGray6))
                                    .frame(width: 200, height: 120)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .shimmer()
            }
        }
    }
}
