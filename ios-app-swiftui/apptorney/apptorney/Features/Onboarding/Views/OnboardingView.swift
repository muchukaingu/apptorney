import SwiftUI

struct OnboardingPage: Identifiable {
    let id: Int
    let image: String
    let title: String
    let description: String
}

struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @State private var currentPage = 0

    private let pages: [OnboardingPage] = [
        OnboardingPage(
            id: 0,
            image: "login-icon",
            title: "Apptorney AI",
            description: "Apptorney is an all-inclusive legal research tool for legal practitioners in Zambia, now enhanced with AI features that help you find key legal insights faster, analyze materials with confidence, and work more efficiently."
        ),
        OnboardingPage(
            id: 1,
            image: "case-law",
            title: "Zambian Case Law",
            description: "Apptorney provides a comprehensive library of Zambian Case Law. Find cases quickly by choosing Areas of Law or searching using any terms that you feel might be contained within the case."
        ),
        OnboardingPage(
            id: 2,
            image: "law-lib",
            title: "Zambian Legislations",
            description: "We have carefully digitised all relevant Legislations, Subsidiary Legislations and Applied Laws. Quickly find any piece of Zambian legislation by searching in our comprehensive library of Legislations."
        ),
        OnboardingPage(
            id: 3,
            image: "share",
            title: "Easily Share",
            description: "Easily share content with colleagues and clients. Apptorney also enhances your productivity by allowing you to easily copy content to other applications like Microsoft Word."
        ),
        OnboardingPage(
            id: 4,
            image: "heart",
            title: "Make it Your Own",
            description: "Make Apptorney your own by bookmarking content, setting favorite Thematic Domains, and adding your personal details like a profile picture."
        )
    ]

    var body: some View {
        VStack(spacing: 0) {
            TabView(selection: $currentPage) {
                ForEach(pages) { page in
                    if page.id == 4 {
                        heartPageView(page)
                            .tag(page.id)
                    } else {
                        pageView(page)
                            .tag(page.id)
                    }
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))

            // Bottom section
            VStack(spacing: 16) {
                if currentPage == pages.count - 1 {
                    termsView

                    Button(action: {
                        appState.onboardingComplete = true
                        appState.currentFlow = .auth
                    }) {
                        Text("Get Started")
                            .font(.custom("AvenirNext-Bold", size: 17))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.black)
                            .cornerRadius(10)
                    }
                    .padding(.horizontal, 40)
                } else {
                    Button(action: {
                        withAnimation { currentPage += 1 }
                    }) {
                        Image("right-arrow-2")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 28, height: 28)
                            .foregroundColor(.black)
                    }
                }
            }
            .padding(.bottom, 40)
        }
        .background(Color.white)
    }

    private func pageView(_ page: OnboardingPage) -> some View {
        VStack(spacing: 20) {
            Spacer()

            Image(page.image)
                .resizable()
                .scaledToFit()
                .frame(width: 120, height: 120)

            Text(page.title)
                .font(.custom("AvenirNext-Bold", size: 24))
                .foregroundColor(.black)

            Text(page.description)
                .font(.custom("AvenirNext-Regular", size: 17))
                .foregroundColor(.black)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
                .padding(.horizontal, 32)

            Spacer()
            Spacer()
        }
    }

    private func heartPageView(_ page: OnboardingPage) -> some View {
        VStack(spacing: 20) {
            Spacer()

            AnimatedHeartView()
                .frame(width: 160, height: 160)

            Text(page.title)
                .font(.custom("AvenirNext-Bold", size: 24))
                .foregroundColor(.black)

            Text(page.description)
                .font(.custom("AvenirNext-Regular", size: 17))
                .foregroundColor(.black)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
                .padding(.horizontal, 32)

            Spacer()
            Spacer()
        }
    }

    private var termsView: some View {
        HStack(spacing: 4) {
            Text("I agree to Apptorney's")
                .font(.custom("AvenirNext-Regular", size: 13))
                .foregroundColor(.secondary)

            Button("Terms of Use") {}
                .font(.custom("AvenirNext-Medium", size: 13))
                .foregroundColor(.black)

            Text("&")
                .font(.custom("AvenirNext-Regular", size: 13))
                .foregroundColor(.secondary)

            Button("Privacy Policy") {}
                .font(.custom("AvenirNext-Medium", size: 13))
                .foregroundColor(.black)
        }
    }
}

// MARK: - Animated Heart

struct HeartShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height

        // Start at bottom point
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.92))

        // Left side curve up to left hump
        path.addCurve(
            to: CGPoint(x: w * 0.0, y: h * 0.36),
            control1: CGPoint(x: w * 0.12, y: h * 0.72),
            control2: CGPoint(x: w * 0.0, y: h * 0.56)
        )

        // Left hump top curve
        path.addCurve(
            to: CGPoint(x: w * 0.26, y: h * 0.08),
            control1: CGPoint(x: w * 0.0, y: h * 0.2),
            control2: CGPoint(x: w * 0.12, y: h * 0.08)
        )

        // Top center dip from left
        path.addCurve(
            to: CGPoint(x: w * 0.5, y: h * 0.24),
            control1: CGPoint(x: w * 0.38, y: h * 0.08),
            control2: CGPoint(x: w * 0.5, y: h * 0.16)
        )

        // Top center dip to right
        path.addCurve(
            to: CGPoint(x: w * 0.74, y: h * 0.08),
            control1: CGPoint(x: w * 0.5, y: h * 0.16),
            control2: CGPoint(x: w * 0.62, y: h * 0.08)
        )

        // Right hump top curve
        path.addCurve(
            to: CGPoint(x: w * 1.0, y: h * 0.36),
            control1: CGPoint(x: w * 0.88, y: h * 0.08),
            control2: CGPoint(x: w * 1.0, y: h * 0.2)
        )

        // Right side curve down to bottom point
        path.addCurve(
            to: CGPoint(x: w * 0.5, y: h * 0.92),
            control1: CGPoint(x: w * 1.0, y: h * 0.56),
            control2: CGPoint(x: w * 0.88, y: h * 0.72)
        )

        path.closeSubpath()
        return path
    }
}

struct AnimatedHeartView: View {
    @State private var drawProgress: CGFloat = 0

    var body: some View {
        HeartShape()
            .trim(from: 0, to: drawProgress)
            .stroke(
                Color.black,
                style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round)
            )
            .padding(8)
            .onAppear {
                withAnimation(.easeInOut(duration: 3.0)) {
                    drawProgress = 1.0
                }
            }
    }
}
