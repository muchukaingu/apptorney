import SwiftUI

struct ModernTextField: View {
    let title: String
    @Binding var text: String
    var errorMessage: String? = nil
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType? = nil
    var autocapitalization: TextInputAutocapitalization = .sentences

    @FocusState private var isFocused: Bool
    private var isActive: Bool { isFocused || !text.isEmpty }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack(alignment: .leading) {
                // Floating label
                Text(title)
                    .font(.system(size: isActive ? 12 : 16))
                    .foregroundColor(labelColor)
                    .padding(.horizontal, isActive ? 4 : 0)
                    .background(Color.white)
                    .offset(x: isActive ? 12 : 16, y: isActive ? -22 : 0)
                    .animation(.easeInOut(duration: 0.15), value: isActive)

                // Input field
                if isSecure {
                    SecureField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                } else {
                    TextField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16))
                        .keyboardType(keyboardType)
                        .textContentType(textContentType)
                        .textInputAutocapitalization(autocapitalization)
                        .autocorrectionDisabled()
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                }
            }
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(borderColor, lineWidth: isFocused ? 2 : 1)
            )
            .onTapGesture { isFocused = true }

            if let errorMessage {
                Text(errorMessage)
                    .font(.system(size: 12))
                    .foregroundColor(.red)
                    .padding(.leading, 4)
            }
        }
    }

    private var labelColor: Color {
        if errorMessage != nil { return .red }
        if isFocused { return .black }
        return Color(white: 0.45)
    }

    private var borderColor: Color {
        if errorMessage != nil { return .red }
        if isFocused { return .black }
        return Color(white: 0.78)
    }
}

typealias FloatingTextField = ModernTextField
