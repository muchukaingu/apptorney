import Foundation

struct ChatThread: Codable, Identifiable {
    var id: String
    var title: String?
    var updatedAt: String?
    var lastQuestion: String?
}

struct ChatThreadsResponse: Codable {
    var threads: [ChatThread]?
}
