import Foundation

struct APIResponse: Codable {
    var success: Bool?
    var statusCode: Int?
    var err: APIError?
    var message: String?
    var data: String?
}

struct APIError: Codable {
    var message: String?
    var stack: String?
}

struct DataWrapper<T: Codable>: Codable {
    var data: T?
}

struct CasesWrapper: Codable {
    var cases: [LegalCase]?
}

struct LegislationsWrapper: Codable {
    var legislations: [Legislation]?
}

struct LegislationWrapper: Codable {
    var legislation: Legislation?
}
