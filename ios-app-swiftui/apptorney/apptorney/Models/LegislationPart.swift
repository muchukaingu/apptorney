import Foundation

struct LegislationPart: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var title: String?
    var content: String?
    var children: [LegislationPart]?
}
