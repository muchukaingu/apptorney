import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState

    var body: some View {
        Form {
            // MARK: - Profile
            Section("Profile") {
                LabeledContent("Name", value: authManager.currentUser?.fullName ?? "N/A")
                LabeledContent("Email", value: authManager.currentUser?.email ?? "N/A")
                LabeledContent("Role", value: authManager.currentUser?.role?.capitalized ?? "N/A")
            }

            // MARK: - Subscription
            Section("Subscription") {
                NavigationLink {
                    SubscriptionView()
                } label: {
                    Label("Manage Subscription", systemImage: "star.circle")
                }
            }

            // MARK: - Legal
            Section("Legal") {
                NavigationLink {
                    LegislationDetailView(legislationId: "5badf52b4594190056063cae")
                        .navigationTitle("Terms of Service")
                } label: {
                    Label("Terms of Service", systemImage: "doc.text")
                }

                NavigationLink {
                    LegislationDetailView(legislationId: "5badec9d1a2fa200672d9abe")
                        .navigationTitle("Privacy Policy")
                } label: {
                    Label("Privacy Policy", systemImage: "hand.raised")
                }
            }

            // MARK: - Log Out
            Section {
                Button(role: .destructive) {
                    authManager.clearSession()
                    appState.currentFlow = .auth
                } label: {
                    HStack {
                        Spacer()
                        Text("Log Out")
                        Spacer()
                    }
                }
            }
        }
    }
}
