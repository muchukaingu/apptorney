import SwiftUI

@MainActor
class RegisterViewModel: ObservableObject {
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var organization = ""
    @Published var phoneNumber = ""
    @Published var email = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?
    @Published var firstNameError: String?
    @Published var lastNameError: String?
    @Published var emailError: String?

    func register() async -> Bool {
        // Reset errors
        firstNameError = nil
        lastNameError = nil
        emailError = nil

        var isValid = true

        if firstName.trimmed.isEmpty {
            firstNameError = "First name is required."
            isValid = false
        }
        if lastName.trimmed.isEmpty {
            lastNameError = "Last name is required."
            isValid = false
        }
        let trimmedEmail = email.trimmed
        if trimmedEmail.isEmpty {
            emailError = "Email is required."
            isValid = false
        } else if !trimmedEmail.isValidEmail {
            emailError = "Please enter a valid email address."
            isValid = false
        }

        guard isValid else { return false }

        isLoading = true
        defer { isLoading = false }

        do {
            try await APIClient.shared.requestVoid(.register(
                email: trimmedEmail,
                firstName: firstName.trimmed,
                lastName: lastName.trimmed,
                phoneNumber: phoneNumber.trimmed.isEmpty ? nil : phoneNumber.trimmed,
                organization: organization.trimmed.isEmpty ? nil : organization.trimmed
            ))
            UserDefaults.standard.set(true, forKey: "registrationComplete")
            return true
        } catch let error as AppError {
            switch error {
            case .apiError(let statusCode, let message):
                if statusCode == 409 {
                    snackbar = SnackbarMessage(text: "An account with this email already exists.")
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
