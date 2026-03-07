import SwiftUI

extension Color {
    static let appRed = Color(hex: "D80027")
    static let appBlue = Color(hex: "007AFF")
    static let appBackground = Color(.systemBackground)

    init(hex: String) {
        let scanner = Scanner(string: hex.trimmingCharacters(in: .alphanumerics.inverted))
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(red: Double((rgb >> 16) & 0xFF) / 255, green: Double((rgb >> 8) & 0xFF) / 255, blue: Double(rgb & 0xFF) / 255)
    }
}
