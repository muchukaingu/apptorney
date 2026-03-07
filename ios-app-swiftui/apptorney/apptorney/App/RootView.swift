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
                Text("Update Required")
            case .onboarding:
                Text("Onboarding")
            case .auth:
                Text("Auth")
            case .main:
                Text("Main")
            }
        }
        .task {
            let updateRequired = await SubscriptionService.checkForUpdate()
            appState.determineFlow(updateRequired: updateRequired)
        }
    }
}
