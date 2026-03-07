import Foundation

struct ChatMessage: Identifiable {
    let id = UUID()
    var text: String
    let isUser: Bool
    var references: [ChatReference] = []
    let timestamp: Date = Date()
}

struct ChatReference: Identifiable {
    let id = UUID()
    let source: String
    let sourceId: String
    let type: String
    let title: String
}
