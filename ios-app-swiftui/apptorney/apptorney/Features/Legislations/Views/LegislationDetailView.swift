import SwiftUI

struct LegislationDetailView: View {
    let legislationId: String

    @StateObject private var viewModel = LegislationsViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView("Loading legislation...")
            } else if let legislation = viewModel.selectedLegislation {
                legislationContent(legislation)
            } else {
                EmptyStateView(title: "Legislation not found", systemImage: "doc.questionmark")
            }
        }
        .navigationTitle("Legislation Detail")
        .navigationBarTitleDisplayMode(.inline)
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.loadLegislation(id: legislationId)
        }
    }

    private func legislationContent(_ legislation: Legislation) -> some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 16) {
                // Name
                if let name = legislation.legislationName {
                    sectionView(title: "Name", content: name)
                }

                // Type
                if let type = legislation.legislationType {
                    sectionView(title: "Type", content: type)
                }

                // Volume & Chapter
                HStack(spacing: 24) {
                    if let vol = legislation.volumeNumber {
                        labeledValue(label: "Volume", value: vol)
                    }
                    if let chap = legislation.chapterNumber {
                        labeledValue(label: "Chapter", value: chap)
                    }
                }

                // Date of Assent
                if let date = legislation.dateOfAssent {
                    sectionView(title: "Date of Assent", content: date)
                }

                // Preamble
                if let preamble = legislation.preamble, !preamble.isEmpty {
                    sectionView(title: "Preamble", content: preamble)
                }

                // Parts / Sections
                if let parts = legislation.legislationParts, !parts.isEmpty {
                    Text("Parts & Sections")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.secondary)

                    ForEach(parts) { part in
                        LegislationPartView(part: part, depth: 0)
                    }
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

    private func labeledValue(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.body.weight(.medium))
        }
    }
}

// MARK: - Recursive Part View

struct LegislationPartView: View {
    let part: LegislationPart
    let depth: Int

    var body: some View {
        DisclosureGroup {
            VStack(alignment: .leading, spacing: 8) {
                if let content = part.content, !content.isEmpty {
                    Text(content)
                        .font(.body)
                        .padding(.leading, CGFloat(depth) * 8)
                }

                if let children = part.children, !children.isEmpty {
                    ForEach(children) { child in
                        LegislationPartView(part: child, depth: depth + 1)
                    }
                }
            }
        } label: {
            Text(part.title ?? "Untitled Section")
                .font(.subheadline.weight(.medium))
        }
    }
}
