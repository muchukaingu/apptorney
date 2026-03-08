import SwiftUI

struct RegisterView: View {
    @StateObject private var viewModel = RegisterViewModel()
    @Binding var path: NavigationPath

    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 24) {
                HStack {
                    Text("Sign Up")
                        .font(.system(size: 28, weight: .bold))
                    Spacer()
                    Button("Sign In") {
                        path.append(AuthScreen.login)
                    }
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.black)
                }
            }
            .padding(.horizontal, 24)
            .padding(.top, 36)

            // Form fields
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    ModernTextField(
                        title: "First Name",
                        text: $viewModel.firstName,
                        errorMessage: viewModel.firstNameError,
                        textContentType: .givenName
                    )

                    ModernTextField(
                        title: "Last Name",
                        text: $viewModel.lastName,
                        errorMessage: viewModel.lastNameError,
                        textContentType: .familyName
                    )

                    ModernTextField(
                        title: "Organization (optional)",
                        text: $viewModel.organization,
                        textContentType: .organizationName
                    )

                    ModernTextField(
                        title: "Phone Number (optional)",
                        text: $viewModel.phoneNumber,
                        keyboardType: .phonePad,
                        textContentType: .telephoneNumber
                    )

                    ModernTextField(
                        title: "Email",
                        text: $viewModel.email,
                        errorMessage: viewModel.emailError,
                        keyboardType: .emailAddress,
                        textContentType: .emailAddress,
                        autocapitalization: .never
                    )
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)
                .padding(.bottom, 24)
            }

            // Sign Up button
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
