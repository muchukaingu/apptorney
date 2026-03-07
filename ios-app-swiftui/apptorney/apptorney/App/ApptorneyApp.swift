import SwiftUI

@main
struct ApptorneyApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appState)
                .environmentObject(authManager)
        }
    }
}
