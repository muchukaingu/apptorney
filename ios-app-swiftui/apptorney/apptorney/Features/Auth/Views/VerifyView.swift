import SwiftUI

struct VerifyView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel: VerifyViewModel

    init(email: String) {
        _viewModel = StateObject(wrappedValue: VerifyViewModel(email: email))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(alignment: .leading, spacing: 16) {
                Text("Verify your Email")
                    .font(.system(size: 28, weight: .bold))

                Text("We sent a verification code to **\(viewModel.email)**. Enter the code below to continue.")
                    .font(.system(size: 15))
                    .foregroundColor(Color(white: 0.42))
                    .lineSpacing(3)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 24)
            .padding(.top, 56)

            // OTP input
            VStack(spacing: 20) {
                ModernTextField(
                    title: "Verification Code",
                    text: $viewModel.otp,
                    keyboardType: .numberPad,
                    textContentType: .oneTimeCode
                )

                Button("Resend Code") {
                    Task { await viewModel.resendCode() }
                }
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(.black)
                .disabled(viewModel.isLoading)
            }
            .padding(.horizontal, 24)
            .padding(.top, 36)

            Spacer()

            // Verify button
            Button(action: {
                Task {
                    await viewModel.verify(authManager: authManager, appState: appState)
                }
            }) {
                Group {
                    if viewModel.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text("Verify")
                    }
                }
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(Color.black)
                .cornerRadius(12)
            }
            .disabled(viewModel.isLoading)
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .background(Color.white)
        .snackbar(message: $viewModel.snackbar)
    }
}
