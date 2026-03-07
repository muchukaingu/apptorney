import Foundation

struct User: Codable, Identifiable {
    var id: String { _id ?? "" }
    var _id: String?
    var email: String?
    var firstName: String?
    var lastName: String?
    var phoneNumber: String?
    var organization: String?
    var role: String?

    var fullName: String {
        [firstName, lastName].compactMap { $0 }.joined(separator: " ")
    }
}
