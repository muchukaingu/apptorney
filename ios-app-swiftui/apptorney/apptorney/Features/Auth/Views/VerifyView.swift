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
            VStack(alignment: .leading, spacing: 12) {
                Text("Verify your Email")
                    .font(.largeTitle.bold())

                Text("We sent a verification code to \(viewModel.email). Enter the code below to continue.")
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 24)
            .padding(.top, 24)

            VStack(spacing: 16) {
                TextField("Verification Code", text: $viewModel.otp)
                    .keyboardType(.numberPad)
                    .textContentType(.oneTimeCode)
                    .font(.title2.monospacedDigit())
                    .multilineTextAlignment(.center)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(12)

                Button("Resend Code") {
                    Task { await viewModel.resendCode() }
                }
                .foregroundColor(.appBlue)
                .disabled(viewModel.isLoading)
            }
            .padding(.horizontal, 24)
            .padding(.top, 32)

            Spacer()

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
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.appBlue)
                .cornerRadius(12)
            }
            .disabled(viewModel.isLoading)
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
        }
        .snackbar(message: $viewModel.snackbar)
    }
}
