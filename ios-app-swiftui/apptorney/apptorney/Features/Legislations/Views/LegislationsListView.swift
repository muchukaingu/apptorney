import SwiftUI

struct LegislationsListView: View {
    @StateObject private var viewModel = LegislationsViewModel()
    @State private var showFilterSheet = false

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView("Loading...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if viewModel.legislations.isEmpty {
                EmptyStateView(
                    title: "Search for legislations",
                    systemImage: "doc.text",
                    description: "Enter a search term or use filters"
                )
            } else {
                legislationsList
            }
        }
        .searchable(text: $viewModel.searchText, prompt: "Search legislations...")
        .onChange(of: viewModel.searchText) { _ in
            viewModel.search()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    showFilterSheet = true
                } label: {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                        .foregroundColor(.appBlue)
                }
            }
        }
        .sheet(isPresented: $showFilterSheet) {
            LegislationFilterView(
                onSelectVolume: { volume in
                    Task { await viewModel.loadByVolume(volume: volume) }
                },
                onSelectYearType: { year, type in
                    Task { await viewModel.loadByYear(year: year, type: type) }
                }
            )
        }
        .navigationDestination(for: Legislation.self) { legislation in
            LegislationDetailView(legislationId: legislation.id)
        }
        .snackbar(message: $viewModel.snackbar)
    }

    private var legislationsList: some View {
        List(viewModel.legislations) { legislation in
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

                    if let vol = legislation.volumeNumber {
                        Text("Volume \(vol)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.vertical, 4)
            }
        }
        .listStyle(.plain)
    }
}
