import SwiftUI

struct ChatMessageView: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.isUser { Spacer(minLength: 48) }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 6) {
                Text(message.text.isEmpty && !message.isUser ? "..." : message.text)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(message.isUser ? Color.black : Color(.systemGray6))
                    .foregroundColor(message.isUser ? .white : .primary)
                    .cornerRadius(16)

                // References
                if !message.isUser && !message.references.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(message.references) { ref in
                            NavigationLink {
                                referenceDestination(ref)
                            } label: {
                                HStack(spacing: 4) {
                                    Image(systemName: ref.type == "case" ? "book.closed" : "doc.text")
                                        .font(.caption2)
                                    Text(ref.title)
                                        .font(.caption)
                                        .lineLimit(1)
                                }
                                .foregroundColor(.appBlue)
                            }
                        }
                    }
                    .padding(.leading, 4)
                }
            }

            if !message.isUser { Spacer(minLength: 48) }
        }
    }

    @ViewBuilder
    private func referenceDestination(_ ref: ChatReference) -> some View {
        if ref.type == "case" {
            CaseDetailView(caseId: ref.sourceId)
        } else {
            LegislationDetailView(legislationId: ref.sourceId)
        }
    }
}
