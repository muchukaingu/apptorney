import Foundation

@MainActor
class SearchViewModel: ObservableObject {
    @Published var cases: [LegalCase] = []
    @Published var legislations: [Legislation] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var snackbar: SnackbarMessage?

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        let term = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard term.count >= 2 else {
            cases = []
            legislations = []
            return
        }

        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000)
            guard !Task.isCancelled else { return }
            await performSearch(term: term)
        }
    }

    // MARK: - Private

    private func performSearch(term: String) async {
        isLoading = true
        defer { isLoading = false }

        await withTaskGroup(of: Void.self) { group in
            group.addTask { await self.searchCases(term: term) }
            group.addTask { await self.searchLegislations(term: term) }
        }
    }

    private func searchCases(term: String) async {
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.search(query: term))
            cases = wrapper.data?.cases ?? []
        } catch {
            cases = []
        }
    }

    private func searchLegislations(term: String) async {
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.search(query: term))
            legislations = wrapper.data?.legislations ?? []
        } catch {
            legislations = []
        }
    }
}
