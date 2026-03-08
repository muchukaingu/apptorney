import SwiftUI

struct BookmarksView: View {
    var body: some View {
        EmptyStateView(
            title: "No bookmarks yet",
            systemImage: "bookmark",
            description: "Cases and legislations you bookmark will appear here"
        )
    }
}
