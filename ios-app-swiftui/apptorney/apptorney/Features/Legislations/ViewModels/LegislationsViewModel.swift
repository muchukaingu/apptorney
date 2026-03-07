import Foundation

@MainActor
class LegislationsViewModel: ObservableObject {
    @Published var legislations: [Legislation] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var selectedLegislation: Legislation?
    @Published var snackbar: SnackbarMessage?

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        let term = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard term.count >= 2 else {
            legislations = []
            return
        }

        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000)
            guard !Task.isCancelled else { return }
            await performSearch(term: term)
        }
    }

    func loadByVolume(volume: Int) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.legislationsByVolume(volume: volume))
            legislations = wrapper.data?.legislations ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func loadByYear(year: Int, type: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.legislationsByYear(year: year, type: type))
            legislations = wrapper.data?.legislations ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func loadLegislation(id: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<LegislationWrapper> = try await APIClient.shared.request(.legislationDetail(id: id))
            selectedLegislation = wrapper.data?.legislation
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    // MARK: - Private

    private func performSearch(term: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.search(query: term))
            legislations = wrapper.data?.legislations ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }
}
