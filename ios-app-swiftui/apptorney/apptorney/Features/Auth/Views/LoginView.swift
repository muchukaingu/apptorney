import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    @Binding var path: NavigationPath

    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 24) {
                HStack {
                    Text("Sign In")
                        .font(.system(size: 28, weight: .bold))
                    Spacer()
                    Button("Sign Up") {
                        path.append(AuthScreen.register)
                    }
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.black)
                }
            }
            .padding(.horizontal, 24)
            .padding(.top, 56)

            // Email field
            ModernTextField(
                title: "Email",
                text: $viewModel.email,
                keyboardType: .emailAddress,
                textContentType: .emailAddress,
                autocapitalization: .never
            )
            .padding(.horizontal, 24)
            .padding(.top, 40)

            Spacer()

            // Send Code button
            Button(action: {
                Task {
                    let success = await viewModel.sendCode()
                    if success {
                        path.append(AuthScreen.verify(email: viewModel.email.trimmed))
                    }
                }
            }) {
                Group {
                    if viewModel.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text("Send Code")
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
        .navigationBarBackButtonHidden(true)
        .snackbar(message: $viewModel.snackbar)
    }
}
