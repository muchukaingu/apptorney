import SwiftUI

struct SnackbarMessage: Equatable {
    let text: String
    var isError: Bool = true
}

struct SnackbarModifier: ViewModifier {
    @Binding var message: SnackbarMessage?

    func body(content: Content) -> some View {
        ZStack(alignment: .top) {
            content
            if let message {
                Text(message.text)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(Capsule().fill(Color.black))
                    .padding(.top, 8)
                    .transition(.move(edge: .top).combined(with: .opacity))
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
