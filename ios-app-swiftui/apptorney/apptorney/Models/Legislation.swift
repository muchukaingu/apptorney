import Foundation

struct Legislation: Codable, Identifiable {
    var id: String { _id ?? "" }
    var _id: String?
    var legislationNumber: String?
    var legislationName: String?
    var legislationNumbers: String?
    var preamble: String?
    var highlight: String?
    var legislationParts: [LegislationPart]?
    var legislationType: String?
    var volumeNumber: String?
    var chapterNumber: String?
    var dateOfAssent: String?
    var enactment: String?
    var yearOfAmendment: Int?
}
