import SwiftUI

@MainActor
class VerifyViewModel: ObservableObject {
    @Published var otp = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    let email: String

    init(email: String) {
        self.email = email
    }

    func verify(authManager: AuthManager, appState: AppState) async {
        let trimmedOtp = otp.trimmed
        guard !trimmedOtp.isEmpty else {
            snackbar = SnackbarMessage(text: "Please enter the verification code.")
            return
        }

        isLoading = true
        defer { isLoading = false }

        do {
            try await authManager.verifyOtp(email: email, otp: trimmedOtp)
            appState.currentFlow = .main
        } catch let error as AppError {
            switch error {
            case .apiError(let statusCode, let message):
                if statusCode == 400 {
                    snackbar = SnackbarMessage(text: "Invalid or expired code. Please try again.")
                } else {
                    snackbar = SnackbarMessage(text: message)
                }
            default:
                snackbar = SnackbarMessage(text: error.localizedDescription)
            }
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }

    func resendCode() async {
        isLoading = true
        defer { isLoading = false }

        do {
            try await APIClient.shared.requestVoid(.resendOtp(email: email))
            snackbar = SnackbarMessage(text: "A new code has been sent to your email.", isError: false)
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
        }
    }
}
