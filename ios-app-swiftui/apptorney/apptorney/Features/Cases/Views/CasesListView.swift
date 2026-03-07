import SwiftUI

struct CasesListView: View {
    @StateObject private var viewModel = CasesViewModel()
    @State private var filterMode: CaseFilterMode = .search
    @State private var showFilterSheet = false

    var body: some View {
        VStack(spacing: 0) {
            Picker("Filter", selection: $filterMode) {
                ForEach(CaseFilterMode.allCases, id: \.self) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.vertical, 8)

            Group {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if viewModel.cases.isEmpty {
                    EmptyStateView(
                        title: filterMode == .search ? "Search for cases" : "No cases found",
                        systemImage: "book.closed",
                        description: filterMode == .search ? "Enter a search term above" : "Try a different filter"
                    )
                } else {
                    casesList
                }
            }
        }
        .searchable(text: $viewModel.searchText, prompt: "Search cases...")
        .onChange(of: viewModel.searchText) { _ in
            if filterMode == .search {
                viewModel.search()
            }
        }
        .onChange(of: filterMode) { newMode in
            viewModel.cases = []
            viewModel.searchText = ""
            if newMode != .search {
                showFilterSheet = true
            }
        }
        .sheet(isPresented: $showFilterSheet) {
            CaseFilterView(
                mode: filterMode,
                areasOfLaw: viewModel.areasOfLaw,
                onSelectArea: { area in
                    Task { await viewModel.loadByArea(areaId: area.id) }
                },
                onSelectYear: { year in
                    Task { await viewModel.loadByYear(year: year) }
                }
            )
        }
        .navigationDestination(for: LegalCase.self) { legalCase in
            CaseDetailView(caseId: legalCase.id)
        }
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.loadAreasOfLaw()
        }
    }

    private var casesList: some View {
        List(viewModel.cases) { legalCase in
            NavigationLink(value: legalCase) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(legalCase.name ?? "Untitled Case")
                        .font(.headline)
                        .lineLimit(2)

                    if let citation = legalCase.citation?.name {
                        Text(citation)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    if let area = legalCase.areaOfLaw?.name {
                        Text(area)
                            .font(.caption2)
                            .foregroundColor(.appBlue)
                    }
                }
                .padding(.vertical, 4)
            }
        }
        .listStyle(.plain)
    }
}
