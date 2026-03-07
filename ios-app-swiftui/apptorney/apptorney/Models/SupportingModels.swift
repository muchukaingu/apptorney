import Foundation

struct Party: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
}

struct Appearance: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var advocate: String?
    var lawFirm: String?
}

struct Coram: Codable {
    var name: String?
}

struct Court: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
}

struct Division: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
}

struct Jurisdiction: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
}

struct Location: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
}

struct AreaOfLaw: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var name: String?
    var description: String?
}

struct FileAttachment: Codable, Identifiable {
    var id: String?
    var name: String?
    var type: String?
    var url: String?
}

struct TableContent: Codable, Identifiable {
    var id: String?
    var title: String?
    var content: [String]?
}

struct WorkReference: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var title: String?
    var author: String?
}
