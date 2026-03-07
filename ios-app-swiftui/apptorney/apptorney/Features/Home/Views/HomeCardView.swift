import SwiftUI

struct HomeCardView: View {
    let item: HomeItem

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(item.title ?? "Untitled")
                .font(.headline)
                .lineLimit(2)

            Text(item.summary ?? "")
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(3)

            Spacer()
        }
        .padding(12)
        .frame(width: 200, height: 120, alignment: .topLeading)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}
