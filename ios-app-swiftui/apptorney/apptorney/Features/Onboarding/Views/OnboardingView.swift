import SwiftUI

struct OnboardingPage: Identifiable {
    let id: Int
    let icon: String
    let title: String
    let description: String
}

struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @State private var currentPage = 0

    private let pages: [OnboardingPage] = [
        OnboardingPage(id: 0, icon: "sparkles", title: "Apptorney AI", description: "All-inclusive legal research tool with AI features"),
        OnboardingPage(id: 1, icon: "book.closed", title: "Zambian Case Law", description: "Comprehensive case law library with search"),
        OnboardingPage(id: 2, icon: "doc.text", title: "Zambian Legislations", description: "Digitized legislations and subsidiary laws"),
        OnboardingPage(id: 3, icon: "square.and.arrow.up", title: "Easily Share", description: "Share content and copy to Word"),
        OnboardingPage(id: 4, icon: "heart", title: "Make it Your Own", description: "Bookmarks, favorites, and profile customization")
    ]

    var body: some View {
        VStack {
            TabView(selection: $currentPage) {
                ForEach(pages) { page in
                    VStack(spacing: 24) {
                        Spacer()
                        Image(systemName: page.icon)
                            .font(.system(size: 80))
                            .foregroundColor(.appBlue)
                        Text(page.title)
                            .font(.title.bold())
                        Text(page.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                        Spacer()
                    }
                    .tag(page.id)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))

            Button(action: {
                if currentPage < pages.count - 1 {
                    withAnimation { currentPage += 1 }
                } else {
                    appState.onboardingComplete = true
                    appState.currentFlow = .auth
                }
            }) {
                Text(currentPage < pages.count - 1 ? "Next" : "Get Started")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appBlue)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
        }
    }
}
