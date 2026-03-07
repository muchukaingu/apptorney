import SwiftUI

enum AuthScreen: Hashable {
    case login
    case register
    case verify(email: String)
}

struct AuthFlowView: View {
    var startOnLogin: Bool = false
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            Group {
                if startOnLogin {
                    LoginView(path: $path)
                } else {
                    RegisterView(path: $path)
                }
            }
            .navigationDestination(for: AuthScreen.self) { screen in
                switch screen {
                case .login:
                    LoginView(path: $path)
                case .register:
                    RegisterView(path: $path)
                case .verify(let email):
                    VerifyView(email: email)
                }
            }
        }
    }
}
