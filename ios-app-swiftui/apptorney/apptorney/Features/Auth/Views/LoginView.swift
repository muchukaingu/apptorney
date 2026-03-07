import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    @Binding var path: NavigationPath

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Sign In")
                    .font(.largeTitle.bold())
                Spacer()
                Button("Sign Up") {
                    path.append(AuthScreen.register)
                }
                .foregroundColor(.appBlue)
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)

            VStack(spacing: 16) {
                FloatingTextField(
                    title: "Email",
                    text: $viewModel.email,
                    keyboardType: .emailAddress,
                    textContentType: .emailAddress,
                    autocapitalization: .never
                )
            }
            .padding(.horizontal, 24)
            .padding(.top, 40)

            Spacer()

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
        .navigationBarBackButtonHidden(true)
        .snackbar(message: $viewModel.snackbar)
    }
}
