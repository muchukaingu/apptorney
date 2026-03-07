import SwiftUI

struct SnackbarMessage: Equatable {
    let text: String
    var isError: Bool = true
}

struct SnackbarModifier: ViewModifier {
    @Binding var message: SnackbarMessage?

    func body(content: Content) -> some View {
        ZStack(alignment: .bottom) {
            content
            if let message {
                Text(message.text)
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(message.isError ? Color.red.opacity(0.9) : Color.green.opacity(0.9))
                    .cornerRadius(8)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                            withAnimation { self.message = nil }
                        }
                    }
            }
        }
        .animation(.spring(), value: message)
    }
}

extension View {
    func snackbar(message: Binding<SnackbarMessage?>) -> some View {
        modifier(SnackbarModifier(message: message))
    }
}
