import Foundation

actor APIClient {
    static let shared = APIClient()

    private let baseURL = "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api"
    private let session: URLSession
    private let decoder: JSONDecoder

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: config)
        self.decoder = JSONDecoder()
    }

    // MARK: - Public Methods

    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let data = try await requestData(endpoint)
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw AppError.decodingError(error)
        }
    }

    func requestData(_ endpoint: Endpoint) async throws -> Data {
        let request = try buildRequest(endpoint)
        let (data, response) = try await performRequest(request)
        try validateResponse(response, data: data)
        return data
    }

    func requestVoid(_ endpoint: Endpoint) async throws {
        let request = try buildRequest(endpoint)
        let (data, response) = try await performRequest(request)
        try validateResponse(response, data: data)
    }

    func streamRequest(_ endpoint: Endpoint) async throws -> URLSession.AsyncBytes {
        let request = try buildRequest(endpoint)
        let (bytes, response) = try await session.bytes(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AppError.unknown("Invalid response")
        }
        if httpResponse.statusCode == 401 {
            throw AppError.authExpired
        }
        guard (200...299).contains(httpResponse.statusCode) else {
            throw AppError.apiError(statusCode: httpResponse.statusCode, message: "Stream request failed")
        }
        return bytes
    }

    // MARK: - Private Methods

    private func buildRequest(_ endpoint: Endpoint) throws -> URLRequest {
        var components = URLComponents(string: baseURL + endpoint.path)
        if let queryItems = endpoint.queryItems {
            components?.queryItems = queryItems
        }

        guard let url = components?.url else {
            throw AppError.unknown("Invalid URL: \(endpoint.path)")
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue

        // Default headers
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("4449615d-b5b2-4e16-a059-f6bda4486953", forHTTPHeaderField: "X-IBM-Client-ID")
        request.setValue("81ed3948-6ca5-4936-be0b-5db9aec1107b", forHTTPHeaderField: "X-IBM-Client-Secret")

        // Auth header
        if endpoint.requiresAuth {
            if let token = KeychainService.load(key: "accessToken") {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }
        }

        if let body = endpoint.body {
            request.httpBody = body
        }

        return request
    }

    private func performRequest(_ request: URLRequest) async throws -> (Data, URLResponse) {
        do {
            return try await session.data(for: request)
        } catch let error as URLError {
            throw AppError.networkError(error)
        } catch {
            throw AppError.unknown(error.localizedDescription)
        }
    }

    private func validateResponse(_ response: URLResponse, data: Data) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AppError.unknown("Invalid response")
        }

        if httpResponse.statusCode == 401 {
            throw AppError.authExpired
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let message: String
            if let apiResp = try? JSONDecoder().decode(APIResponse.self, from: data),
               let errMsg = apiResp.err?.message ?? apiResp.message {
                message = errMsg
            } else {
                message = "Request failed with status \(httpResponse.statusCode)"
            }
            throw AppError.apiError(statusCode: httpResponse.statusCode, message: message)
        }
    }
}
