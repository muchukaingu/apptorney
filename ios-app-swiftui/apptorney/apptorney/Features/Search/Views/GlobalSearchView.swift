import SwiftUI

struct GlobalSearchView: View {
    @StateObject private var viewModel = SearchViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView("Searching...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if viewModel.cases.isEmpty && viewModel.legislations.isEmpty {
                EmptyStateView(
                    title: "Search cases & legislations",
                    systemImage: "magnifyingglass",
                    description: "Enter a search term to find cases and legislations"
                )
            } else {
                resultsList
            }
        }
        .searchable(text: $viewModel.searchText, prompt: "Search everything...")
        .onChange(of: viewModel.searchText) { _ in
            viewModel.search()
        }
        .navigationDestination(for: LegalCase.self) { legalCase in
            CaseDetailView(caseId: legalCase.id)
        }
        .navigationDestination(for: Legislation.self) { legislation in
            LegislationDetailView(legislationId: legislation.id)
        }
        .snackbar(message: $viewModel.snackbar)
    }

    private var resultsList: some View {
        List {
            if !viewModel.cases.isEmpty {
                Section("Cases") {
                    ForEach(viewModel.cases) { legalCase in
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
                            }
                            .padding(.vertical, 2)
                        }
                    }
                }
            }

            if !viewModel.legislations.isEmpty {
                Section("Legislations") {
                    ForEach(viewModel.legislations) { legislation in
                        NavigationLink(value: legislation) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(legislation.legislationName ?? "Untitled Legislation")
                                    .font(.headline)
                                    .lineLimit(2)

                                if let type = legislation.legislationType {
                                    Text(type)
                                        .font(.caption)
                                        .foregroundColor(.appBlue)
                                }
                            }
                            .padding(.vertical, 2)
                        }
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
    }
}
