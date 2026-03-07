import SwiftUI

enum LegislationFilterMode: String, CaseIterable {
    case search = "Search"
    case volume = "Volume"
    case yearType = "Year & Type"
}

struct LegislationFilterView: View {
    let onSelectVolume: (Int) -> Void
    let onSelectYearType: (Int, String) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var selectedVolume = 1
    @State private var selectedYear = Calendar.current.component(.year, from: Date())
    @State private var selectedType = "Act"

    private let volumeRange = Array(1...30)
    private let legislationTypes = ["Act", "Bill", "Regulation", "Statutory Instrument", "Subsidiary Legislation"]

    private var yearRange: [Int] {
        let current = Calendar.current.component(.year, from: Date())
        return Array((1960...current).reversed())
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Filter by Volume") {
                    Picker("Volume", selection: $selectedVolume) {
                        ForEach(volumeRange, id: \.self) { vol in
                            Text("Volume \(vol)").tag(vol)
                        }
                    }

                    Button("Load by Volume") {
                        onSelectVolume(selectedVolume)
                        dismiss()
                    }
                    .foregroundColor(.appBlue)
                }

                Section("Filter by Year & Type") {
                    Picker("Year", selection: $selectedYear) {
                        ForEach(yearRange, id: \.self) { year in
                            Text(String(year)).tag(year)
                        }
                    }

                    Picker("Type", selection: $selectedType) {
                        ForEach(legislationTypes, id: \.self) { type in
                            Text(type).tag(type)
                        }
                    }

                    Button("Load by Year & Type") {
                        onSelectYearType(selectedYear, selectedType)
                        dismiss()
                    }
                    .foregroundColor(.appBlue)
                }
            }
            .navigationTitle("Filter Legislations")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}
