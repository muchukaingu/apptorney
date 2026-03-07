import Foundation
import Combine

@MainActor
class CasesViewModel: ObservableObject {
    @Published var cases: [LegalCase] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var areasOfLaw: [AreaOfLaw] = []
    @Published var selectedCase: LegalCase?
    @Published var snackbar: SnackbarMessage?

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        let term = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard term.count >= 2 else {
            cases = []
            return
        }

        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000)
            guard !Task.isCancelled else { return }
            await performSearch(term: term)
        }
    }

    func loadByArea(areaId: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.casesByAreaOfLaw(areaId: areaId))
            cases = wrapper.data?.cases ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func loadByYear(year: Int) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.casesByYear(year: year))
            cases = wrapper.data?.cases ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func loadCase(id: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let legalCase: LegalCase = try await APIClient.shared.request(.caseDetail(id: id))
            selectedCase = legalCase
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func loadAreasOfLaw() async {
        do {
            let areas: [AreaOfLaw] = try await APIClient.shared.request(.areasOfLaw())
            areasOfLaw = areas
        } catch {
            // Silently fail — areas are optional for filtering
        }
    }

    // MARK: - Private

    private func performSearch(term: String) async {
        isLoading = true
        defer { isLoading = false }
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.search(query: term))
            cases = wrapper.data?.cases ?? []
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }
}
