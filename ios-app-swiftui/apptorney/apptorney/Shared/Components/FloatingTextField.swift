import SwiftUI

struct FloatingTextField: View {
    let title: String
    @Binding var text: String
    var errorMessage: String? = nil
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType? = nil
    var autocapitalization: TextInputAutocapitalization = .sentences

    @FocusState private var isFocused: Bool
    private var shouldFloat: Bool { isFocused || !text.isEmpty }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack(alignment: .leading) {
                Text(title)
                    .font(.system(size: shouldFloat ? 12 : 16, weight: .light))
                    .foregroundColor(errorMessage != nil ? .red : (isFocused ? .accentColor : .gray))
                    .offset(y: shouldFloat ? -24 : 0)
                    .animation(.easeInOut(duration: 0.2), value: shouldFloat)

                if isSecure {
                    SecureField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16, weight: .light))
                } else {
                    TextField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16, weight: .light))
                        .keyboardType(keyboardType)
                        .textContentType(textContentType)
                        .textInputAutocapitalization(autocapitalization)
                        .autocorrectionDisabled()
                }
            }
            .padding(.top, 16)

            Rectangle()
                .frame(height: isFocused ? 2 : 1)
                .foregroundColor(errorMessage != nil ? .red : (isFocused ? .accentColor : .gray.opacity(0.5)))

            if let errorMessage {
                Text(errorMessage)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}
