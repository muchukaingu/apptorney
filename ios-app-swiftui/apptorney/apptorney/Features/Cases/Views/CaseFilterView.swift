import SwiftUI

enum CaseFilterMode: String, CaseIterable {
    case search = "Search"
    case area = "Area of Law"
    case year = "Year"
}

struct CaseFilterView: View {
    let mode: CaseFilterMode
    let areasOfLaw: [AreaOfLaw]
    let onSelectArea: (AreaOfLaw) -> Void
    let onSelectYear: (Int) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var selectedYear = Calendar.current.component(.year, from: Date())

    private var yearRange: [Int] {
        let current = Calendar.current.component(.year, from: Date())
        return Array((1960...current).reversed())
    }

    var body: some View {
        NavigationStack {
            Group {
                switch mode {
                case .area:
                    areaList
                case .year:
                    yearPicker
                case .search:
                    EmptyView()
                }
            }
            .navigationTitle(mode == .area ? "Select Area of Law" : "Select Year")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private var areaList: some View {
        List(areasOfLaw) { area in
            Button {
                onSelectArea(area)
                dismiss()
            } label: {
                VStack(alignment: .leading, spacing: 4) {
                    Text(area.name ?? "Unknown")
                        .font(.body)
                        .foregroundColor(.primary)
                    if let desc = area.description, !desc.isEmpty {
                        Text(desc)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }
                }
            }
        }
    }

    private var yearPicker: some View {
        List(yearRange, id: \.self) { year in
            Button {
                onSelectYear(year)
                dismiss()
            } label: {
                Text(String(year))
                    .font(.body)
                    .foregroundColor(.primary)
            }
        }
    }
}
