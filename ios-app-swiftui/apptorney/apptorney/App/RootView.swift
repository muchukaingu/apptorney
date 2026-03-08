import SwiftUI

struct RootView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Group {
            switch appState.currentFlow {
            case .loading:
                ProgressView("Loading...")
            case .forceUpdate:
                UpdateRequiredView()
            case .onboarding:
                OnboardingView()
            case .auth:
                AuthFlowView(startOnLogin: true)
            case .main:
                MainView()
            }
        }
        .task {
            let updateRequired = await SubscriptionService.checkForUpdate()
            appState.determineFlow(updateRequired: updateRequired)
        }
    }
}
