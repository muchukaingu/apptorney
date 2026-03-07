import Foundation

@MainActor
class HomeViewModel: ObservableObject {
    @Published var bookmarks: [HomeItem] = []
    @Published var news: [HomeItem] = []
    @Published var trends: [HomeItem] = []
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    func loadAll(username: String) async {
        isLoading = true
        defer { isLoading = false }

        await withTaskGroup(of: Void.self) { group in
            group.addTask { await self.loadBookmarks(username: username) }
            group.addTask { await self.loadNews() }
            group.addTask { await self.loadTrends() }
        }
    }

    func addBookmark(username: String, sourceId: String, type: String) async {
        do {
            try await APIClient.shared.requestVoid(.addBookmark(username: username, sourceId: sourceId, type: type))
            snackbar = SnackbarMessage(text: "Bookmark added", isError: false)
            await loadBookmarks(username: username)
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    // MARK: - Private

    private func loadBookmarks(username: String) async {
        guard !username.isEmpty else { return }
        do {
            let items: [HomeItem] = try await APIClient.shared.request(.bookmarks(username: username))
            bookmarks = items
        } catch {
            // Bookmarks may return empty for new users
            bookmarks = []
        }
    }

    private func loadNews() async {
        do {
            let items: [HomeItem] = try await APIClient.shared.request(.news)
            news = items
        } catch {
            news = []
        }
    }

    private func loadTrends() async {
        do {
            let items: [HomeItem] = try await APIClient.shared.request(.trends)
            trends = items
        } catch {
            trends = []
        }
    }
}
