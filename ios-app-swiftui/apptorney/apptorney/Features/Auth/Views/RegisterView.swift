import SwiftUI

struct RegisterView: View {
    @StateObject private var viewModel = RegisterViewModel()
    @Binding var path: NavigationPath

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Sign Up")
                    .font(.largeTitle.bold())
                Spacer()
                Button("Sign In") {
                    path.append(AuthScreen.login)
                }
                .foregroundColor(.appBlue)
            }
            .padding(.horizontal, 24)
            .padding(.top, 24)

            ScrollView {
                VStack(spacing: 16) {
                    FloatingTextField(
                        title: "First Name",
                        text: $viewModel.firstName,
                        errorMessage: viewModel.firstNameError,
                        textContentType: .givenName
                    )

                    FloatingTextField(
                        title: "Last Name",
                        text: $viewModel.lastName,
                        errorMessage: viewModel.lastNameError,
                        textContentType: .familyName
                    )

                    FloatingTextField(
                        title: "Organization (optional)",
                        text: $viewModel.organization,
                        textContentType: .organizationName
                    )

                    FloatingTextField(
                        title: "Phone Number (optional)",
                        text: $viewModel.phoneNumber,
                        keyboardType: .phonePad,
                        textContentType: .telephoneNumber
                    )

                    FloatingTextField(
                        title: "Email",
                        text: $viewModel.email,
                        errorMessage: viewModel.emailError,
                        keyboardType: .emailAddress,
                        textContentType: .emailAddress,
                        autocapitalization: .never
                    )
                }
                .padding(.horizontal, 24)
                .padding(.top, 24)
            }

            Button(action: {
                Task {
                    let success = await viewModel.register()
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
                        Text("Sign Up")
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
