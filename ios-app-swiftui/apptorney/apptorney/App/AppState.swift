import SwiftUI

enum AppFlow {
    case loading
    case forceUpdate
    case onboarding
    case auth
    case main
}

@MainActor
class AppState: ObservableObject {
    @Published var currentFlow: AppFlow = .loading
    @AppStorage("onboardingComplete") var onboardingComplete = false
    @AppStorage("loginComplete") var loginComplete = false

    func determineFlow(updateRequired: Bool) {
        if updateRequired {
            currentFlow = .forceUpdate
        } else if !onboardingComplete {
            currentFlow = .onboarding
        } else if !loginComplete || !AuthManager.hasValidSession() {
            currentFlow = .auth
        } else {
            currentFlow = .main
        }
    }
}
