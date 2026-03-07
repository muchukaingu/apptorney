import SwiftUI

struct CaseDetailView: View {
    let caseId: String

    @StateObject private var viewModel = CasesViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView("Loading case...")
            } else if let legalCase = viewModel.selectedCase {
                caseContent(legalCase)
            } else {
                EmptyStateView(title: "Case not found", systemImage: "doc.questionmark")
            }
        }
        .navigationTitle("Case Detail")
        .navigationBarTitleDisplayMode(.inline)
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.loadCase(id: caseId)
        }
    }

    private func caseContent(_ legalCase: LegalCase) -> some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 16) {
                // Name
                if let name = legalCase.name {
                    sectionView(title: "Case Name", content: name)
                }

                // Citation
                if let citation = legalCase.citation {
                    let citationText = [citation.name, citation.year, citation.volume, citation.page]
                        .compactMap { $0 }
                        .joined(separator: " ")
                    if !citationText.isEmpty {
                        sectionView(title: "Citation", content: citationText)
                    }
                }

                // Plaintiffs
                if let plaintiffs = legalCase.plaintiffs, !plaintiffs.isEmpty {
                    sectionView(title: "Plaintiffs", content: plaintiffs.compactMap(\.name).joined(separator: ", "))
                }

                // Defendants
                if let defendants = legalCase.defendants, !defendants.isEmpty {
                    sectionView(title: "Defendants", content: defendants.compactMap(\.name).joined(separator: ", "))
                }

                // Court
                if let court = legalCase.court?.name {
                    sectionView(title: "Court", content: court)
                }

                // Area of Law
                if let area = legalCase.areaOfLaw?.name {
                    sectionView(title: "Area of Law", content: area)
                }

                // Summary of Facts
                if let facts = legalCase.summaryOfFacts, !facts.isEmpty {
                    sectionView(title: "Summary of Facts", content: facts)
                }

                // Summary of Ruling
                if let ruling = legalCase.summaryOfRuling, !ruling.isEmpty {
                    sectionView(title: "Summary of Ruling", content: ruling)
                }

                // Judgment
                if let judgment = legalCase.judgement, !judgment.isEmpty {
                    sectionView(title: "Judgment", content: judgment)
                }
            }
            .padding()
        }
    }

    private func sectionView(title: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)

            Text(content)
                .font(.body)
        }
    }
}
