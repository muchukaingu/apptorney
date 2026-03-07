import Foundation

struct HomeItem: Codable, Identifiable {
    var id: String { sourceId ?? UUID().uuidString }
    var title: String?
    var summary: String?
    var type: String?
    var sourceId: String?
}
