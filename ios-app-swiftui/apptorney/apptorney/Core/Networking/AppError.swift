import Foundation

enum AppError: LocalizedError {
    case networkError(URLError)
    case apiError(statusCode: Int, message: String)
    case authExpired
    case decodingError(Error)
    case unknown(String)

    var errorDescription: String? {
        switch self {
        case .networkError(let error): return error.localizedDescription
        case .apiError(_, let message): return message
        case .authExpired: return "Session expired. Please log in again."
        case .decodingError(let error): return "Data error: \(error.localizedDescription)"
        case .unknown(let message): return message
        }
    }
}
