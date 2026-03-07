import SwiftUI

@MainActor
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    func sendCode() async -> Bool {
        let trimmedEmail = email.trimmed
        guard !trimmedEmail.isEmpty else {
            snackbar = SnackbarMessage(text: "Please enter your email address.")
            return false
        }
        guard trimmedEmail.isValidEmail else {
            snackbar = SnackbarMessage(text: "Please enter a valid email address.")
            return false
        }

        isLoading = true
        defer { isLoading = false }

        do {
            try await APIClient.shared.requestVoid(.login(email: trimmedEmail))
            return true
        } catch let error as AppError {
            switch error {
            case .apiError(let statusCode, let message):
                if statusCode == 404 {
                    snackbar = SnackbarMessage(text: "No account found with this email.")
                } else if statusCode == 429 {
                    snackbar = SnackbarMessage(text: "Too many requests. Please try again later.")
                } else {
                    snackbar = SnackbarMessage(text: message)
                }
            default:
                snackbar = SnackbarMessage(text: error.localizedDescription)
            }
            return false
        } catch {
            snackbar = SnackbarMessage(text: error.localizedDescription)
            return false
        }
    }
}
