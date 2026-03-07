import Foundation

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

struct Endpoint {
    let path: String
    let method: HTTPMethod
    let queryItems: [URLQueryItem]?
    let body: Data?
    let requiresAuth: Bool

    init(
        path: String,
        method: HTTPMethod = .get,
        queryItems: [URLQueryItem]? = nil,
        body: Data? = nil,
        requiresAuth: Bool = true
    ) {
        self.path = path
        self.method = method
        self.queryItems = queryItems
        self.body = body
        self.requiresAuth = requiresAuth
    }

    // MARK: - Auth

    static func login(email: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: ["email": email])
        return Endpoint(path: "/auth/login", method: .post, body: body, requiresAuth: false)
    }

    static func register(email: String, firstName: String, lastName: String, phoneNumber: String?, organization: String?) -> Endpoint {
        var params: [String: String] = [
            "email": email,
            "firstName": firstName,
            "lastName": lastName
        ]
        if let phone = phoneNumber, !phone.isEmpty { params["phoneNumber"] = phone }
        if let org = organization, !org.isEmpty { params["organization"] = org }
        let body = try? JSONSerialization.data(withJSONObject: params)
        return Endpoint(path: "/auth/register", method: .post, body: body, requiresAuth: false)
    }

    static func verifyOtp(email: String, otp: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: ["email": email, "otp": otp])
        return Endpoint(path: "/auth/verify-otp", method: .post, body: body, requiresAuth: false)
    }

    static func refreshToken(refreshToken: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: ["refreshToken": refreshToken])
        return Endpoint(path: "/auth/refresh", method: .post, body: body, requiresAuth: false)
    }

    static func resendOtp(email: String) -> Endpoint {
        return login(email: email)
    }

    // MARK: - Cases

    static func cases(page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/cases", queryItems: items)
    }

    static func caseDetail(id: String) -> Endpoint {
        return Endpoint(path: "/cases/\(id)")
    }

    static func casesByYear(year: Int) -> Endpoint {
        let items = [URLQueryItem(name: "year", value: "\(year)")]
        return Endpoint(path: "/cases/getByYear", queryItems: items)
    }

    static func casesByAreaOfLaw(areaId: String, page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "areaOfLaw", value: areaId),
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/cases", queryItems: items)
    }

    // MARK: - Legislations

    static func legislations(page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/legislations", queryItems: items)
    }

    static func legislationDetail(id: String) -> Endpoint {
        return Endpoint(path: "/legislations/\(id)")
    }

    static func legislationsByVolume(volume: Int) -> Endpoint {
        let items = [URLQueryItem(name: "volume", value: "\(volume)")]
        return Endpoint(path: "/legislations/getByVolume", queryItems: items)
    }

    static func legislationsByYear(year: Int, type: String) -> Endpoint {
        let items = [
            URLQueryItem(name: "year", value: "\(year)"),
            URLQueryItem(name: "type", value: type)
        ]
        return Endpoint(path: "/legislations/getByYear", queryItems: items)
    }

    static func legislationsByType(type: String, page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "legislationType", value: type),
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/legislations", queryItems: items)
    }

    // MARK: - Home

    static func homeItems(page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/home", queryItems: items)
    }

    // MARK: - Search

    static func search(query: String, page: Int = 1, limit: Int = 20) -> Endpoint {
        let items = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return Endpoint(path: "/searches", queryItems: items)
    }

    // MARK: - Chat / AI

    static func askAI(question: String, threadId: String? = nil, accessToken: String? = nil) -> Endpoint {
        var items = [
            URLQueryItem(name: "question", value: question),
            URLQueryItem(name: "includeCases", value: "true"),
            URLQueryItem(name: "includeLegislations", value: "true"),
            URLQueryItem(name: "stream", value: "true")
        ]
        if let threadId = threadId { items.append(URLQueryItem(name: "threadId", value: threadId)) }
        if let accessToken = accessToken { items.append(URLQueryItem(name: "access_token", value: accessToken)) }
        return Endpoint(path: "/searches/ask-ai", method: .get, queryItems: items)
    }

    static func chatThreads() -> Endpoint {
        return Endpoint(path: "/searches/chat-threads")
    }

    static func chatThread(id: String) -> Endpoint {
        return Endpoint(path: "/searches/chat-threads/\(id)")
    }

    static func deleteChatThread(id: String) -> Endpoint {
        return Endpoint(path: "/searches/chat-threads/\(id)", method: .delete)
    }

    // MARK: - Subscription / Update

    static func checkSubscription(userName: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: ["userName": userName])
        return Endpoint(path: "/subscriptions/checkSubscription", method: .post, body: body)
    }

    static func checkForUpdate(version: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: ["version": version])
        return Endpoint(path: "/updates/checkForUpdate", method: .post, body: body, requiresAuth: false)
    }

    // MARK: - Bookmarks

    static func bookmarks(username: String) -> Endpoint {
        let items = [URLQueryItem(name: "username", value: username)]
        return Endpoint(path: "/Customers/bookmarks", queryItems: items)
    }

    static func addBookmark(username: String, sourceId: String, type: String) -> Endpoint {
        let body = try? JSONSerialization.data(withJSONObject: [
            "username": username,
            "sourceId": sourceId,
            "type": type
        ])
        return Endpoint(path: "/Customers/bookmark", method: .post, body: body)
    }

    // MARK: - News & Trends

    static var news: Endpoint {
        Endpoint(path: "/news/viewNews")
    }

    static var trends: Endpoint {
        Endpoint(path: "/trendings/viewTrends")
    }

    // MARK: - Areas of Law

    static func areasOfLaw() -> Endpoint {
        return Endpoint(path: "/areas-of-law")
    }
}
