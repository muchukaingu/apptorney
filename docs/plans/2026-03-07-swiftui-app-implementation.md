# Apptorney SwiftUI App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete SwiftUI iOS app with full feature parity to the existing UIKit app, zero external dependencies, targeting iOS 16+.

**Architecture:** MVVM with ObservableObject. URLSession actor for networking, Keychain for token storage, NavigationStack for navigation, custom side menu for hamburger nav.

**Tech Stack:** SwiftUI, Swift 5.9+, URLSession async/await, StoreKit 2, CryptoKit, Keychain Services

**Base path:** `ios-app-swiftui/apptorney/apptorney/`

**API Base URL:** `http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api`

**API Headers:**
```
X-IBM-Client-ID: 4449615d-b5b2-4e16-a059-f6bda4486953
X-IBM-Client-Secret: 81ed3948-6ca5-4936-be0b-5db9aec1107b
Authorization: Bearer {accessToken}
Content-Type: application/json
Accept: application/json
```

**Auth endpoints (OTP-based):**
- POST `/auth/login` — body: `{email}` — sends OTP
- POST `/auth/register` — body: `{email, firstName, lastName, phoneNumber, organization}` — creates user, sends OTP
- POST `/auth/verify-otp` — body: `{email, otp}` — returns `{accessToken, refreshToken, user}`
- POST `/auth/resend-otp` — body: `{email}` — resends OTP
- POST `/auth/refresh` — body: `{refreshToken}` — returns `{accessToken}`

---

## Task 1: Create Xcode Project

**Files:**
- Create: `ios-app-swiftui/apptorney/apptorney.xcodeproj` (via Xcode CLI)
- Create: `ios-app-swiftui/apptorney/apptorney/ApptorneyApp.swift`

**Step 1: Create the Xcode project using command line**

```bash
cd "/Users/muchukaingu/Documents/1. Work/4. apptorney/Projects/Development/apptorney-monorepo"
mkdir -p ios-app-swiftui/apptorney/apptorney
```

Use `xcodegen` or create manually. The simplest path: create via Xcode CLI won't work, so create a minimal project structure by hand.

Create the directory structure:
```bash
cd ios-app-swiftui/apptorney/apptorney
mkdir -p App Core/Networking Core/Auth Core/Storage
mkdir -p Features/Auth/Views Features/Auth/ViewModels
mkdir -p Features/Home/Views Features/Home/ViewModels
mkdir -p Features/Chat/Views Features/Chat/ViewModels
mkdir -p Features/Cases/Views Features/Cases/ViewModels
mkdir -p Features/Legislations/Views Features/Legislations/ViewModels
mkdir -p Features/Search/Views Features/Search/ViewModels
mkdir -p Features/Settings/Views Features/Settings/ViewModels
mkdir -p Features/Subscription/Views Features/Subscription/ViewModels
mkdir -p Features/Onboarding/Views
mkdir -p Features/Update/Views
mkdir -p Models Shared/Components Shared/Extensions
mkdir -p Assets.xcassets
```

**Step 2: Create the app entry point**

Create `App/ApptorneyApp.swift`:
```swift
import SwiftUI

@main
struct ApptorneyApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appState)
                .environmentObject(authManager)
        }
    }
}
```

**Step 3: Create AppState**

Create `App/AppState.swift`:
```swift
import SwiftUI

enum AppFlow {
    case loading
    case forceUpdate
    case onboarding
    case auth
    case main
}

@MainActor
class AppState: ObservableObject {
    @Published var currentFlow: AppFlow = .loading
    @AppStorage("onboardingComplete") var onboardingComplete = false
    @AppStorage("loginComplete") var loginComplete = false

    func determineFlow(updateRequired: Bool) {
        if updateRequired {
            currentFlow = .forceUpdate
        } else if !onboardingComplete {
            currentFlow = .onboarding
        } else if !loginComplete || !AuthManager.hasValidSession() {
            currentFlow = .auth
        } else {
            currentFlow = .main
        }
    }
}
```

**Step 4: Create RootView stub**

Create `App/RootView.swift`:
```swift
import SwiftUI

struct RootView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Group {
            switch appState.currentFlow {
            case .loading:
                ProgressView("Loading...")
            case .forceUpdate:
                Text("Update Required")
            case .onboarding:
                Text("Onboarding")
            case .auth:
                Text("Auth")
            case .main:
                Text("Main")
            }
        }
        .task {
            await checkForUpdate()
        }
    }

    private func checkForUpdate() async {
        let updateRequired = await SubscriptionService.checkForUpdate()
        appState.determineFlow(updateRequired: updateRequired)
    }
}
```

**Step 5: Build and verify**

```bash
xcodebuild -project apptorney.xcodeproj -scheme apptorney -destination 'platform=iOS Simulator,name=iPhone 16 Pro' -sdk iphonesimulator build
```

**Step 6: Commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: scaffold SwiftUI app with project structure and app entry point"
```

---

## Task 2: Core Models

**Files:**
- Create: `Models/User.swift`
- Create: `Models/Case.swift`
- Create: `Models/Legislation.swift`
- Create: `Models/LegislationPart.swift`
- Create: `Models/HomeItem.swift`
- Create: `Models/ChatMessage.swift`
- Create: `Models/ChatThread.swift`
- Create: `Models/Citation.swift`
- Create: `Models/SupportingModels.swift`
- Create: `Models/APIResponse.swift`

**Step 1: Create all model files**

`Models/User.swift`:
```swift
import Foundation

struct User: Codable, Identifiable {
    var id: String { _id ?? "" }
    var _id: String?
    var email: String?
    var firstName: String?
    var lastName: String?
    var phoneNumber: String?
    var organization: String?
    var role: String?

    var fullName: String {
        [firstName, lastName].compactMap { $0 }.joined(separator: " ")
    }
}
```

`Models/SupportingModels.swift`:
```swift
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
```

`Models/Citation.swift`:
```swift
import Foundation

struct Citation: Codable {
    var name: String?
    var year: String?
    var volume: String?
    var page: String?
}
```

`Models/Case.swift`:
```swift
import Foundation

struct LegalCase: Codable, Identifiable {
    var id: String { _id ?? "" }
    var _id: String?
    var referenceNumber: String?
    var name: String?
    var caseNumber: String?
    var highlight: String?
    var plaintiffs: [Party]?
    var defendants: [Party]?
    var appearancesForPlaintiffs: [Appearance]?
    var appearancesForDefendants: [Appearance]?
    var coram: [Coram]?
    var citation: Citation?
    var summaryOfFacts: String?
    var summaryOfRuling: String?
    var judgement: String?
    var court: Court?
    var courtDivision: Division?
    var location: Location?
    var jurisdiction: Jurisdiction?
    var areaOfLaw: AreaOfLaw?
    var workReferedTo: [WorkReference]?
    var legislationsReferedTo: [Legislation]?
    var casesReferedTo: [LegalCase]?
}
```

`Models/Legislation.swift`:
```swift
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
```

`Models/LegislationPart.swift`:
```swift
import Foundation

struct LegislationPart: Codable, Identifiable {
    var id: String { _id ?? UUID().uuidString }
    var _id: String?
    var title: String?
    var content: String?
    var children: [LegislationPart]?
}
```

`Models/HomeItem.swift`:
```swift
import Foundation

struct HomeItem: Codable, Identifiable {
    var id: String { sourceId ?? UUID().uuidString }
    var title: String?
    var summary: String?
    var type: String?
    var sourceId: String?
}
```

`Models/ChatMessage.swift`:
```swift
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
```

`Models/ChatThread.swift`:
```swift
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
```

`Models/APIResponse.swift`:
```swift
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
```

**Step 2: Build and verify**
```bash
xcodebuild build ...
```

**Step 3: Commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add all Codable model structs"
```

---

## Task 3: Core — KeychainService, AppError, Endpoint

**Files:**
- Create: `Core/Storage/KeychainService.swift`
- Create: `Core/Networking/AppError.swift`
- Create: `Core/Networking/Endpoint.swift`

**Step 1: Create KeychainService**

`Core/Storage/KeychainService.swift`:
```swift
import Foundation
import Security

enum KeychainService {
    static func save(key: String, value: String) {
        guard let data = value.data(using: .utf8) else { return }
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    static func load(key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func delete(key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
    }
}
```

**Step 2: Create AppError**

`Core/Networking/AppError.swift`:
```swift
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
```

**Step 3: Create Endpoint**

`Core/Networking/Endpoint.swift`:
```swift
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
    let body: [String: Any]?

    init(path: String, method: HTTPMethod = .get, queryItems: [URLQueryItem]? = nil, body: [String: Any]? = nil) {
        self.path = path
        self.method = method
        self.queryItems = queryItems
        self.body = body
    }
}

// MARK: - Auth Endpoints
extension Endpoint {
    static func login(email: String) -> Endpoint {
        Endpoint(path: "/auth/login", method: .post, body: ["email": email])
    }

    static func register(email: String, firstName: String, lastName: String, phoneNumber: String, organization: String) -> Endpoint {
        Endpoint(path: "/auth/register", method: .post, body: [
            "email": email, "firstName": firstName, "lastName": lastName,
            "phoneNumber": phoneNumber, "organization": organization
        ])
    }

    static func verifyOtp(email: String, otp: String) -> Endpoint {
        Endpoint(path: "/auth/verify-otp", method: .post, body: ["email": email, "otp": otp])
    }

    static func resendOtp(email: String) -> Endpoint {
        Endpoint(path: "/auth/resend-otp", method: .post, body: ["email": email])
    }

    static func refreshToken(_ refreshToken: String) -> Endpoint {
        Endpoint(path: "/auth/refresh", method: .post, body: ["refreshToken": refreshToken])
    }
}

// MARK: - Cases Endpoints
extension Endpoint {
    static func searchCases(term: String) -> Endpoint {
        Endpoint(path: "/cases/mobilesearch", queryItems: [URLQueryItem(name: "term", value: term)])
    }

    static func casesByArea(areaId: String) -> Endpoint {
        Endpoint(path: "/cases/getByArea", queryItems: [URLQueryItem(name: "areaId", value: areaId)])
    }

    static func casesByYear(year: Int) -> Endpoint {
        Endpoint(path: "/cases/getByYear", queryItems: [URLQueryItem(name: "year", value: String(year))])
    }

    static func loadCase(id: String) -> Endpoint {
        Endpoint(path: "/cases/viewCase", queryItems: [URLQueryItem(name: "id", value: id)])
    }
}

// MARK: - Legislations Endpoints
extension Endpoint {
    static func searchLegislations(term: String) -> Endpoint {
        Endpoint(path: "/legislations/mobilesearch", queryItems: [URLQueryItem(name: "term", value: term)])
    }

    static func legislationsByVolume(volume: Int) -> Endpoint {
        Endpoint(path: "/legislations/getByVolume", queryItems: [URLQueryItem(name: "volume", value: String(volume))])
    }

    static func legislationsByYear(year: Int, type: String) -> Endpoint {
        Endpoint(path: "/legislations/getByYear", queryItems: [
            URLQueryItem(name: "year", value: String(year)),
            URLQueryItem(name: "type", value: type)
        ])
    }

    static func loadLegislation(id: String) -> Endpoint {
        Endpoint(path: "/legislations/viewLegislation", queryItems: [URLQueryItem(name: "id", value: id)])
    }
}

// MARK: - Home Endpoints
extension Endpoint {
    static func bookmarks(username: String) -> Endpoint {
        Endpoint(path: "/Customers/bookmarks", queryItems: [URLQueryItem(name: "username", value: username)])
    }

    static func addBookmark(username: String, sourceId: String, type: String) -> Endpoint {
        Endpoint(path: "/Customers/bookmark", method: .post, body: [
            "username": username, "sourceId": sourceId, "type": type
        ])
    }

    static var news: Endpoint {
        Endpoint(path: "/news/viewNews")
    }

    static var trends: Endpoint {
        Endpoint(path: "/trendings/viewTrends")
    }
}

// MARK: - Areas of Law
extension Endpoint {
    static var areasOfLaw: Endpoint {
        Endpoint(path: "/areaOfLaws/parents")
    }
}

// MARK: - Chat Endpoints
extension Endpoint {
    static func askAI(question: String, threadId: String? = nil, accessToken: String? = nil) -> Endpoint {
        var items = [
            URLQueryItem(name: "question", value: question),
            URLQueryItem(name: "includeCases", value: "true"),
            URLQueryItem(name: "includeLegislations", value: "true"),
            URLQueryItem(name: "stream", value: "true")
        ]
        if let threadId { items.append(URLQueryItem(name: "threadId", value: threadId)) }
        if let accessToken { items.append(URLQueryItem(name: "access_token", value: accessToken)) }
        return Endpoint(path: "/searches/ask-ai", queryItems: items)
    }

    static var chatThreads: Endpoint {
        Endpoint(path: "/searches/chat-threads")
    }

    static func chatThread(id: String) -> Endpoint {
        Endpoint(path: "/searches/chat-threads/\(id)")
    }
}

// MARK: - Subscription/Update
extension Endpoint {
    static func checkSubscription(username: String) -> Endpoint {
        Endpoint(path: "/subscriptions/checkSubscription", queryItems: [URLQueryItem(name: "userName", value: username)])
    }

    static func checkForUpdate(version: String) -> Endpoint {
        Endpoint(path: "/updates/checkForUpdate", queryItems: [URLQueryItem(name: "version", value: version)])
    }
}
```

**Step 4: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add KeychainService, AppError, and all API Endpoint definitions"
```

---

## Task 4: Core — APIClient Actor

**Files:**
- Create: `Core/Networking/APIClient.swift`

**Step 1: Create APIClient**

`Core/Networking/APIClient.swift`:
```swift
import Foundation

actor APIClient {
    static let shared = APIClient()

    private let baseURL = "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api"
    private let clientId = "4449615d-b5b2-4e16-a059-f6bda4486953"
    private let clientSecret = "81ed3948-6ca5-4936-be0b-5db9aec1107b"
    private let session: URLSession
    private let decoder: JSONDecoder

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        self.session = URLSession(configuration: config)
        self.decoder = JSONDecoder()
    }

    // MARK: - Generic typed request

    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let request = try buildRequest(endpoint)
        let (data, response) = try await session.data(for: request)
        try validateResponse(response)
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw AppError.decodingError(error)
        }
    }

    // MARK: - Raw data request (for non-Decodable responses)

    func requestData(_ endpoint: Endpoint) async throws -> (Data, HTTPURLResponse) {
        let request = try buildRequest(endpoint)
        let (data, response) = try await session.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AppError.unknown("Invalid response")
        }
        return (data, httpResponse)
    }

    // MARK: - Void request (fire and forget with error checking)

    func requestVoid(_ endpoint: Endpoint) async throws {
        let request = try buildRequest(endpoint)
        let (_, response) = try await session.data(for: request)
        try validateResponse(response)
    }

    // MARK: - SSE streaming request

    func streamRequest(_ endpoint: Endpoint) throws -> URLRequest {
        var request = try buildRequest(endpoint)
        request.setValue("text/event-stream", forHTTPHeaderField: "Accept")
        request.setValue("identity", forHTTPHeaderField: "Accept-Encoding")
        request.timeoutInterval = 120
        request.cachePolicy = .reloadIgnoringLocalAndRemoteCacheData
        return request
    }

    // MARK: - Private helpers

    private func buildRequest(_ endpoint: Endpoint) throws -> URLRequest {
        guard var components = URLComponents(string: baseURL + endpoint.path) else {
            throw AppError.unknown("Invalid URL: \(endpoint.path)")
        }
        if let queryItems = endpoint.queryItems {
            components.queryItems = queryItems
        }
        guard let url = components.url else {
            throw AppError.unknown("Cannot construct URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue(clientId, forHTTPHeaderField: "X-IBM-Client-ID")
        request.setValue(clientSecret, forHTTPHeaderField: "X-IBM-Client-Secret")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if let token = KeychainService.load(key: "accessToken") {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = endpoint.body {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }

        return request
    }

    private func validateResponse(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else {
            throw AppError.unknown("Invalid response")
        }
        switch http.statusCode {
        case 200...299: return
        case 401: throw AppError.authExpired
        default:
            throw AppError.apiError(statusCode: http.statusCode, message: "Request failed with status \(http.statusCode)")
        }
    }
}
```

**Step 2: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add APIClient actor with URLSession async/await networking"
```

---

## Task 5: Core — AuthManager

**Files:**
- Create: `Core/Auth/AuthManager.swift`

**Step 1: Create AuthManager**

`Core/Auth/AuthManager.swift`:
```swift
import SwiftUI

@MainActor
class AuthManager: ObservableObject {
    @Published var currentUser: User?
    @Published var isAuthenticated = false

    init() {
        loadSession()
    }

    // MARK: - Session management

    static func hasValidSession() -> Bool {
        KeychainService.load(key: "accessToken") != nil
    }

    func loadSession() {
        guard let token = KeychainService.load(key: "accessToken") else {
            isAuthenticated = false
            return
        }
        isAuthenticated = true
        let defaults = UserDefaults.standard
        currentUser = User(
            _id: defaults.string(forKey: "userId"),
            email: defaults.string(forKey: "userEmail"),
            firstName: defaults.string(forKey: "userName")?.components(separatedBy: " ").first,
            lastName: defaults.string(forKey: "userName")?.components(separatedBy: " ").dropFirst().joined(separator: " "),
            role: defaults.string(forKey: "userRole")
        )
    }

    func persistSession(accessToken: String, refreshToken: String, userId: String, email: String, userName: String, role: String) {
        KeychainService.save(key: "accessToken", value: accessToken)
        KeychainService.save(key: "refreshToken", value: refreshToken)

        let defaults = UserDefaults.standard
        defaults.set(userId, forKey: "userId")
        defaults.set(email, forKey: "userEmail")
        defaults.set(userName, forKey: "userName")
        defaults.set(role, forKey: "userRole")
        defaults.set(true, forKey: "loginComplete")

        isAuthenticated = true
        currentUser = User(_id: userId, email: email, firstName: userName.components(separatedBy: " ").first, lastName: userName.components(separatedBy: " ").dropFirst().joined(separator: " "), role: role)
    }

    func clearSession() {
        KeychainService.delete(key: "accessToken")
        KeychainService.delete(key: "refreshToken")
        UserDefaults.standard.set(false, forKey: "loginComplete")
        isAuthenticated = false
        currentUser = nil
    }

    // MARK: - Token refresh

    func refreshAccessToken() async -> Bool {
        guard let refreshToken = KeychainService.load(key: "refreshToken") else { return false }
        do {
            let (data, _) = try await APIClient.shared.requestData(.refreshToken(refreshToken))
            if let dict = try JSONSerialization.jsonObject(with: data) as? [String: Any],
               let newToken = dict["accessToken"] as? String, newToken.count >= 12 {
                KeychainService.save(key: "accessToken", value: newToken)
                return true
            }
            return false
        } catch {
            return false
        }
    }
}
```

**Step 2: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add AuthManager with Keychain-based session management"
```

---

## Task 6: Shared Components

**Files:**
- Create: `Shared/Components/FloatingTextField.swift`
- Create: `Shared/Components/SnackbarModifier.swift`
- Create: `Shared/Components/ShimmerModifier.swift`
- Create: `Shared/Components/SideMenuContainer.swift`
- Create: `Shared/Extensions/Color+App.swift`
- Create: `Shared/Extensions/String+Validation.swift`
- Create: `Shared/Extensions/Date+Formatting.swift`

**Step 1: FloatingTextField**

`Shared/Components/FloatingTextField.swift`:
```swift
import SwiftUI

struct FloatingTextField: View {
    let title: String
    @Binding var text: String
    var errorMessage: String? = nil
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType? = nil
    var autocapitalization: TextInputAutocapitalization = .sentences

    @FocusState private var isFocused: Bool

    private var shouldFloat: Bool { isFocused || !text.isEmpty }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack(alignment: .leading) {
                Text(title)
                    .font(.system(size: shouldFloat ? 12 : 16, weight: .light))
                    .foregroundColor(errorMessage != nil ? .red : (isFocused ? .accentColor : .gray))
                    .offset(y: shouldFloat ? -24 : 0)
                    .animation(.easeInOut(duration: 0.2), value: shouldFloat)

                if isSecure {
                    SecureField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16, weight: .light))
                } else {
                    TextField("", text: $text)
                        .focused($isFocused)
                        .font(.system(size: 16, weight: .light))
                        .keyboardType(keyboardType)
                        .textContentType(textContentType)
                        .textInputAutocapitalization(autocapitalization)
                        .autocorrectionDisabled()
                }
            }
            .padding(.top, 16)

            Rectangle()
                .frame(height: isFocused ? 2 : 1)
                .foregroundColor(errorMessage != nil ? .red : (isFocused ? .accentColor : .gray.opacity(0.5)))

            if let errorMessage {
                Text(errorMessage)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}
```

**Step 2: SnackbarModifier**

`Shared/Components/SnackbarModifier.swift`:
```swift
import SwiftUI

struct SnackbarMessage: Equatable {
    let text: String
    var isError: Bool = true
}

struct SnackbarModifier: ViewModifier {
    @Binding var message: SnackbarMessage?

    func body(content: Content) -> some View {
        ZStack(alignment: .bottom) {
            content
            if let message {
                Text(message.text)
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(message.isError ? Color.red.opacity(0.9) : Color.green.opacity(0.9))
                    .cornerRadius(8)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                            withAnimation { self.message = nil }
                        }
                    }
            }
        }
        .animation(.spring(), value: message)
    }
}

extension View {
    func snackbar(message: Binding<SnackbarMessage?>) -> some View {
        modifier(SnackbarModifier(message: message))
    }
}
```

**Step 3: ShimmerModifier**

`Shared/Components/ShimmerModifier.swift`:
```swift
import SwiftUI

struct ShimmerModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .redacted(reason: .placeholder)
            .overlay(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.4), .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase)
                .mask(content.redacted(reason: .placeholder))
            )
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                    phase = UIScreen.main.bounds.width
                }
            }
    }
}

extension View {
    func shimmer() -> some View {
        modifier(ShimmerModifier())
    }
}
```

**Step 4: SideMenuContainer**

`Shared/Components/SideMenuContainer.swift`:
```swift
import SwiftUI

struct SideMenuContainer<Menu: View, Content: View>: View {
    @Binding var isOpen: Bool
    let menu: Menu
    let content: Content
    private let menuWidth: CGFloat = 270

    init(isOpen: Binding<Bool>, @ViewBuilder menu: () -> Menu, @ViewBuilder content: () -> Content) {
        self._isOpen = isOpen
        self.menu = menu()
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .leading) {
            content
                .offset(x: isOpen ? menuWidth : 0)
                .disabled(isOpen)

            if isOpen {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .offset(x: menuWidth)
                    .onTapGesture { withAnimation(.easeInOut(duration: 0.25)) { isOpen = false } }
            }

            menu
                .frame(width: menuWidth)
                .offset(x: isOpen ? 0 : -menuWidth)
        }
        .animation(.easeInOut(duration: 0.25), value: isOpen)
        .gesture(
            DragGesture()
                .onEnded { value in
                    if value.translation.width > 80 { withAnimation { isOpen = true } }
                    else if value.translation.width < -80 { withAnimation { isOpen = false } }
                }
        )
    }
}
```

**Step 5: Extensions**

`Shared/Extensions/Color+App.swift`:
```swift
import SwiftUI

extension Color {
    static let appRed = Color(hex: "D80027")
    static let appBlue = Color(hex: "007AFF")
    static let appBackground = Color(.systemBackground)

    init(hex: String) {
        let scanner = Scanner(string: hex.trimmingCharacters(in: .alphanumerics.inverted))
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(red: Double((rgb >> 16) & 0xFF) / 255, green: Double((rgb >> 8) & 0xFF) / 255, blue: Double(rgb & 0xFF) / 255)
    }
}
```

`Shared/Extensions/String+Validation.swift`:
```swift
import Foundation

extension String {
    var isValidEmail: Bool {
        let regex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: self)
    }

    var trimmed: String {
        trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
```

`Shared/Extensions/Date+Formatting.swift`:
```swift
import Foundation

extension Date {
    var relativeDisplay: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
        return formatter.localizedString(for: self, relativeTo: Date())
    }

    var shortDisplay: String {
        formatted(date: .abbreviated, time: .omitted)
    }
}
```

**Step 6: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add shared components (FloatingTextField, Snackbar, Shimmer, SideMenu) and extensions"
```

---

## Task 7: Onboarding Feature

**Files:**
- Create: `Features/Onboarding/Views/OnboardingView.swift`

**Step 1: Create OnboardingView**

`Features/Onboarding/Views/OnboardingView.swift`:
```swift
import SwiftUI

struct OnboardingPage: Identifiable {
    let id = UUID()
    let icon: String
    let title: String
    let description: String
}

struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @State private var currentPage = 0

    private let pages = [
        OnboardingPage(icon: "sparkles", title: "Apptorney AI", description: "All-inclusive legal research tool with AI features"),
        OnboardingPage(icon: "book.closed", title: "Zambian Case Law", description: "Comprehensive case law library with search"),
        OnboardingPage(icon: "doc.text", title: "Zambian Legislations", description: "Digitized legislations and subsidiary laws"),
        OnboardingPage(icon: "square.and.arrow.up", title: "Easily Share", description: "Share content and copy to Word"),
        OnboardingPage(icon: "heart", title: "Make it Your Own", description: "Bookmarks, favorites, and profile customization")
    ]

    var body: some View {
        VStack {
            TabView(selection: $currentPage) {
                ForEach(Array(pages.enumerated()), id: \.element.id) { index, page in
                    VStack(spacing: 30) {
                        Image(systemName: page.icon)
                            .font(.system(size: 80))
                            .foregroundColor(.appBlue)
                        Text(page.title)
                            .font(.system(size: 28, weight: .heavy))
                        Text(page.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))

            Button(action: {
                if currentPage < pages.count - 1 {
                    withAnimation { currentPage += 1 }
                } else {
                    appState.onboardingComplete = true
                    appState.currentFlow = .auth
                }
            }) {
                Text(currentPage == pages.count - 1 ? "Get Started" : "Next")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.black)
                    .cornerRadius(10)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 30)
        }
    }
}
```

**Step 2: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add onboarding flow with paged TabView"
```

---

## Task 8: Auth Feature — Views and ViewModels

**Files:**
- Create: `Features/Auth/Views/AuthFlowView.swift`
- Create: `Features/Auth/Views/LoginView.swift`
- Create: `Features/Auth/Views/RegisterView.swift`
- Create: `Features/Auth/Views/VerifyView.swift`
- Create: `Features/Auth/ViewModels/LoginViewModel.swift`
- Create: `Features/Auth/ViewModels/RegisterViewModel.swift`
- Create: `Features/Auth/ViewModels/VerifyViewModel.swift`

**Step 1: AuthFlowView (navigation container)**

`Features/Auth/Views/AuthFlowView.swift`:
```swift
import SwiftUI

enum AuthScreen: Hashable {
    case login
    case register
    case verify(email: String)
}

struct AuthFlowView: View {
    @State private var path: [AuthScreen] = []
    @State private var startScreen: AuthScreen

    init(startOnLogin: Bool = false) {
        _startScreen = State(initialValue: startOnLogin ? .login : .register)
    }

    var body: some View {
        NavigationStack(path: $path) {
            Group {
                if startScreen == .login {
                    LoginView(path: $path)
                } else {
                    RegisterView(path: $path)
                }
            }
            .navigationDestination(for: AuthScreen.self) { screen in
                switch screen {
                case .login:
                    LoginView(path: $path)
                case .register:
                    RegisterView(path: $path)
                case .verify(let email):
                    VerifyView(email: email)
                }
            }
        }
    }
}
```

**Step 2: LoginViewModel**

`Features/Auth/ViewModels/LoginViewModel.swift`:
```swift
import SwiftUI

@MainActor
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    func sendCode() async -> Bool {
        let trimmed = email.trimmed.lowercased()
        guard !trimmed.isEmpty, trimmed.isValidEmail else {
            snackbar = SnackbarMessage(text: "Please enter a valid email address.")
            return false
        }
        isLoading = true
        defer { isLoading = false }

        do {
            try await APIClient.shared.requestVoid(.login(email: trimmed))
            return true
        } catch let error as AppError {
            switch error {
            case .apiError(let code, _) where code == 404:
                snackbar = SnackbarMessage(text: "No account found with this email.")
            case .apiError(let code, _) where code == 429:
                snackbar = SnackbarMessage(text: "Please wait before requesting another code.")
            default:
                snackbar = SnackbarMessage(text: "Sign in failed. Please try again.")
            }
            return false
        } catch {
            snackbar = SnackbarMessage(text: "Sign in failed. Please try again.")
            return false
        }
    }
}
```

**Step 3: LoginView**

`Features/Auth/Views/LoginView.swift`:
```swift
import SwiftUI

struct LoginView: View {
    @Binding var path: [AuthScreen]
    @StateObject private var vm = LoginViewModel()
    @FocusState private var emailFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Sign In")
                    .font(.system(size: 30, weight: .heavy))
                Spacer()
                Button("Sign Up") {
                    path = [.register]
                }
                .foregroundColor(.gray)
            }
            .padding(.horizontal, 40)
            .padding(.top, 40)

            ScrollView {
                VStack(spacing: 20) {
                    FloatingTextField(
                        title: "Email",
                        text: $vm.email,
                        keyboardType: .emailAddress,
                        textContentType: .emailAddress,
                        autocapitalization: .never
                    )
                    .focused($emailFocused)
                }
                .padding(.horizontal, 40)
                .padding(.top, 20)
            }

            Spacer()

            Button(action: {
                Task {
                    if await vm.sendCode() {
                        path.append(.verify(email: vm.email.trimmed.lowercased()))
                    }
                }
            }) {
                HStack {
                    Text(vm.isLoading ? "Sending code..." : "Send Code")
                        .font(.system(size: 20, weight: .bold))
                    if vm.isLoading {
                        ProgressView().tint(.white)
                    }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.black)
                .cornerRadius(10)
            }
            .disabled(vm.isLoading)
            .padding(.horizontal, 20)
            .padding(.bottom, 30)
        }
        .snackbar(message: $vm.snackbar)
        .navigationBarBackButtonHidden()
        .onAppear { emailFocused = true }
    }
}
```

**Step 4: RegisterViewModel**

`Features/Auth/ViewModels/RegisterViewModel.swift`:
```swift
import SwiftUI

@MainActor
class RegisterViewModel: ObservableObject {
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var organization = ""
    @Published var phoneNumber = ""
    @Published var email = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?
    @Published var firstNameError: String?
    @Published var lastNameError: String?
    @Published var emailError: String?

    func register() async -> Bool {
        var valid = true
        firstNameError = nil; lastNameError = nil; emailError = nil

        if firstName.trimmed.isEmpty { firstNameError = "First Name is required"; valid = false }
        if lastName.trimmed.isEmpty { lastNameError = "Last Name is required"; valid = false }
        if email.trimmed.isEmpty || !email.trimmed.isValidEmail { emailError = "Enter a valid email address"; valid = false }
        guard valid else { return false }

        isLoading = true
        defer { isLoading = false }

        do {
            try await APIClient.shared.requestVoid(.register(
                email: email.trimmed.lowercased(),
                firstName: firstName.trimmed,
                lastName: lastName.trimmed,
                phoneNumber: phoneNumber.trimmed,
                organization: organization.trimmed
            ))
            UserDefaults.standard.set(true, forKey: "registrationComplete")
            return true
        } catch let error as AppError {
            if case .apiError(let code, _) = error, code == 409 {
                snackbar = SnackbarMessage(text: "An account with this email already exists.")
            } else {
                snackbar = SnackbarMessage(text: "Sign up failed. Please try again.")
            }
            return false
        } catch {
            snackbar = SnackbarMessage(text: "Sign up failed. Please try again.")
            return false
        }
    }
}
```

**Step 5: RegisterView**

`Features/Auth/Views/RegisterView.swift`:
```swift
import SwiftUI

struct RegisterView: View {
    @Binding var path: [AuthScreen]
    @StateObject private var vm = RegisterViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Sign Up")
                    .font(.system(size: 30, weight: .heavy))
                Spacer()
                Button("Sign In") {
                    path = [.login]
                }
                .foregroundColor(.gray)
            }
            .padding(.horizontal, 40)
            .padding(.top, 40)

            ScrollView {
                VStack(spacing: 16) {
                    FloatingTextField(title: "First Name", text: $vm.firstName, errorMessage: vm.firstNameError, textContentType: .givenName)
                    FloatingTextField(title: "Last Name", text: $vm.lastName, errorMessage: vm.lastNameError, textContentType: .familyName)
                    FloatingTextField(title: "Organization", text: $vm.organization)
                    FloatingTextField(title: "Phone Number", text: $vm.phoneNumber, keyboardType: .phonePad, textContentType: .telephoneNumber)
                    FloatingTextField(title: "Email Address", text: $vm.email, errorMessage: vm.emailError, keyboardType: .emailAddress, textContentType: .emailAddress, autocapitalization: .never)
                }
                .padding(.horizontal, 40)
                .padding(.top, 20)
            }

            Spacer()

            Button(action: {
                Task {
                    if await vm.register() {
                        path.append(.verify(email: vm.email.trimmed.lowercased()))
                    }
                }
            }) {
                HStack {
                    Text(vm.isLoading ? "Signing up..." : "Sign Up")
                        .font(.system(size: 20, weight: .bold))
                    if vm.isLoading { ProgressView().tint(.white) }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.black)
                .cornerRadius(10)
            }
            .disabled(vm.isLoading)
            .padding(.horizontal, 20)
            .padding(.bottom, 30)
        }
        .snackbar(message: $vm.snackbar)
        .navigationBarBackButtonHidden()
    }
}
```

**Step 6: VerifyViewModel**

`Features/Auth/ViewModels/VerifyViewModel.swift`:
```swift
import SwiftUI

@MainActor
class VerifyViewModel: ObservableObject {
    @Published var otp = ""
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    let email: String

    init(email: String) {
        self.email = email
    }

    func verify(authManager: AuthManager, appState: AppState) async {
        let trimmedOtp = otp.trimmed
        guard !trimmedOtp.isEmpty else {
            snackbar = SnackbarMessage(text: "Please enter the verification code.")
            return
        }

        isLoading = true
        defer { isLoading = false }

        do {
            let (data, _) = try await APIClient.shared.requestData(.verifyOtp(email: email, otp: trimmedOtp))
            guard let dict = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let accessToken = dict["accessToken"] as? String,
                  let refreshToken = dict["refreshToken"] as? String else {
                snackbar = SnackbarMessage(text: "Invalid response from server.")
                return
            }
            let user = dict["user"] as? [String: Any] ?? [:]
            let userId = (user["id"] as? String) ?? (user["_id"] as? String) ?? ""
            let role = user["role"] as? String ?? "user"
            let userName = "\(user["firstName"] as? String ?? "") \(user["lastName"] as? String ?? "")".trimmed

            authManager.persistSession(
                accessToken: accessToken, refreshToken: refreshToken,
                userId: userId, email: email, userName: userName, role: role
            )
            appState.currentFlow = .main
        } catch {
            snackbar = SnackbarMessage(text: "Verification failed. Please check your code and try again.")
        }
    }

    func resendCode() async {
        do {
            try await APIClient.shared.requestVoid(.resendOtp(email: email))
            snackbar = SnackbarMessage(text: "Code sent! Check your email inbox.", isError: false)
        } catch {
            snackbar = SnackbarMessage(text: "Could not resend code. Please try again.")
        }
    }
}
```

**Step 7: VerifyView**

`Features/Auth/Views/VerifyView.swift`:
```swift
import SwiftUI

struct VerifyView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState
    @StateObject private var vm: VerifyViewModel
    @FocusState private var otpFocused: Bool

    init(email: String) {
        _vm = StateObject(wrappedValue: VerifyViewModel(email: email))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Verify your Email")
                .font(.system(size: 30, weight: .heavy))
                .padding(.top, 50)

            Text("Verification code sent to your email")
                .foregroundColor(.secondary)

            TextField("Enter verification code", text: $vm.otp)
                .keyboardType(.numberPad)
                .textContentType(.oneTimeCode)
                .font(.system(size: 20))
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .focused($otpFocused)

            Button("Resend Code") {
                Task { await vm.resendCode() }
            }
            .foregroundColor(.gray)

            Spacer()

            Button(action: {
                Task { await vm.verify(authManager: authManager, appState: appState) }
            }) {
                HStack {
                    Text(vm.isLoading ? "Verifying..." : "Verify")
                        .font(.system(size: 20, weight: .bold))
                    if vm.isLoading { ProgressView().tint(.white) }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.black)
                .cornerRadius(10)
            }
            .disabled(vm.isLoading)
            .padding(.bottom, 30)
        }
        .padding(.horizontal, 40)
        .snackbar(message: $vm.snackbar)
        .navigationBarBackButtonHidden()
        .onAppear { otpFocused = true }
    }
}
```

**Step 8: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add complete auth flow (Login, Register, Verify) with ViewModels"
```

---

## Task 9: Update Check & SubscriptionService

**Files:**
- Create: `Features/Update/Views/UpdateRequiredView.swift`
- Create: `Core/Networking/SubscriptionService.swift`

**Step 1: SubscriptionService**

`Core/Networking/SubscriptionService.swift`:
```swift
import Foundation

enum SubscriptionService {
    static func checkForUpdate() async -> Bool {
        guard let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String else { return false }
        do {
            let response: APIResponse = try await APIClient.shared.request(.checkForUpdate(version: version))
            return response.data == "update"
        } catch {
            return false
        }
    }

    static func checkSubscription(username: String) async -> Bool {
        do {
            let response: APIResponse = try await APIClient.shared.request(.checkSubscription(username: username))
            return response.statusCode == 200
        } catch {
            return false
        }
    }
}
```

**Step 2: UpdateRequiredView**

`Features/Update/Views/UpdateRequiredView.swift`:
```swift
import SwiftUI

struct UpdateRequiredView: View {
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "arrow.down.app")
                .font(.system(size: 60))
                .foregroundColor(.appBlue)
            Text("Update Required")
                .font(.title.bold())
            Text("A new version of Apptorney is available. Please update to continue.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
                .padding(.horizontal, 40)
            Button("Update Now") {
                if let url = URL(string: "itms-apps://itunes.apple.com/app/apptorney/id1234567890") {
                    UIApplication.shared.open(url)
                }
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
```

**Step 3: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add update check service and UpdateRequiredView"
```

---

## Task 10: Main Shell with Side Menu

**Files:**
- Create: `Features/Home/Views/MainView.swift`
- Create: `Features/Home/Views/SideMenuView.swift`

**Step 1: SideMenuView**

`Features/Home/Views/SideMenuView.swift`:
```swift
import SwiftUI

enum MenuDestination: String, CaseIterable, Identifiable {
    case home = "Home"
    case cases = "Cases"
    case legislations = "Legislations"
    case search = "Search"
    case settings = "Settings"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .home: return "house"
        case .cases: return "book.closed"
        case .legislations: return "doc.text"
        case .search: return "magnifyingglass"
        case .settings: return "gearshape"
        }
    }
}

struct SideMenuView: View {
    @Binding var selected: MenuDestination
    @Binding var isOpen: Bool
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: "person.circle.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.white)
                Text(authManager.currentUser?.fullName ?? "User")
                    .font(.headline)
                    .foregroundColor(.white)
                Text(authManager.currentUser?.email ?? "")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.black)

            ForEach(MenuDestination.allCases) { item in
                Button(action: {
                    selected = item
                    withAnimation { isOpen = false }
                }) {
                    HStack(spacing: 16) {
                        Image(systemName: item.icon)
                            .frame(width: 24)
                        Text(item.rawValue)
                    }
                    .foregroundColor(selected == item ? .appBlue : .primary)
                    .padding(.vertical, 14)
                    .padding(.horizontal, 20)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }

            Spacer()

            Button(action: {
                authManager.clearSession()
                appState.currentFlow = .auth
            }) {
                HStack(spacing: 16) {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .frame(width: 24)
                    Text("Log Out")
                }
                .foregroundColor(.red)
                .padding(.vertical, 14)
                .padding(.horizontal, 20)
            }
            .padding(.bottom, 30)
        }
        .background(Color(.systemBackground))
    }
}
```

**Step 2: MainView**

`Features/Home/Views/MainView.swift`:
```swift
import SwiftUI

struct MainView: View {
    @State private var menuOpen = false
    @State private var selectedDestination: MenuDestination = .home

    var body: some View {
        SideMenuContainer(isOpen: $menuOpen) {
            SideMenuView(selected: $selectedDestination, isOpen: $menuOpen)
        } content: {
            NavigationStack {
                Group {
                    switch selectedDestination {
                    case .home: HomeView()
                    case .cases: CasesListView()
                    case .legislations: LegislationsListView()
                    case .search: GlobalSearchView()
                    case .settings: SettingsView()
                    }
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button(action: { withAnimation { menuOpen.toggle() } }) {
                            Image(systemName: "line.3.horizontal")
                                .foregroundColor(.primary)
                        }
                    }
                }
            }
        }
    }
}
```

**Step 3: Update RootView to use real views**

Update `App/RootView.swift` to use actual views:
```swift
import SwiftUI

struct RootView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Group {
            switch appState.currentFlow {
            case .loading:
                ProgressView("Loading...")
            case .forceUpdate:
                UpdateRequiredView()
            case .onboarding:
                OnboardingView()
            case .auth:
                AuthFlowView(startOnLogin: UserDefaults.standard.bool(forKey: "registrationComplete"))
            case .main:
                MainView()
            }
        }
        .task {
            await checkForUpdate()
        }
    }

    private func checkForUpdate() async {
        let updateRequired = await SubscriptionService.checkForUpdate()
        appState.determineFlow(updateRequired: updateRequired)
    }
}
```

**Step 4: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add main app shell with hamburger side menu navigation"
```

---

## Task 11: Home Feature

**Files:**
- Create: `Features/Home/Views/HomeView.swift`
- Create: `Features/Home/Views/HomeCardView.swift`
- Create: `Features/Home/ViewModels/HomeViewModel.swift`

**Step 1: HomeViewModel**

`Features/Home/ViewModels/HomeViewModel.swift`:
```swift
import SwiftUI

@MainActor
class HomeViewModel: ObservableObject {
    @Published var bookmarks: [HomeItem] = []
    @Published var news: [HomeItem] = []
    @Published var trends: [HomeItem] = []
    @Published var isLoading = true
    @Published var snackbar: SnackbarMessage?

    func loadAll(username: String) async {
        isLoading = true
        async let b = loadBookmarks(username: username)
        async let n = loadNews()
        async let t = loadTrends()
        _ = await (b, n, t)
        isLoading = false
    }

    private func loadBookmarks(username: String) async {
        do { bookmarks = try await APIClient.shared.request(.bookmarks(username: username)) } catch {}
    }

    private func loadNews() async {
        do { news = try await APIClient.shared.request(.news) } catch {}
    }

    private func loadTrends() async {
        do { trends = try await APIClient.shared.request(.trends) } catch {}
    }

    func addBookmark(username: String, sourceId: String, type: String) async {
        do {
            try await APIClient.shared.requestVoid(.addBookmark(username: username, sourceId: sourceId, type: type))
            snackbar = SnackbarMessage(text: "Bookmark added!", isError: false)
        } catch {
            snackbar = SnackbarMessage(text: "Failed to add bookmark.")
        }
    }
}
```

**Step 2: HomeCardView**

`Features/Home/Views/HomeCardView.swift`:
```swift
import SwiftUI

struct HomeCardView: View {
    let item: HomeItem

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(item.title ?? "Untitled")
                .font(.headline)
                .lineLimit(2)
            if let summary = item.summary {
                Text(summary)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
        }
        .padding(12)
        .frame(width: 200, alignment: .leading)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}
```

**Step 3: HomeView**

`Features/Home/Views/HomeView.swift`:
```swift
import SwiftUI

struct HomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var vm = HomeViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Welcome, \(authManager.currentUser?.firstName ?? "User")")
                    .font(.title2.bold())
                    .padding(.horizontal, 20)

                Text(Date().formatted(date: .complete, time: .omitted))
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 20)

                if vm.isLoading {
                    homeSection(title: "MY BOOKMARKS", items: Array(repeating: HomeItem(title: "Loading...", summary: "Please wait"), count: 3))
                        .shimmer()
                } else {
                    homeSection(title: "MY BOOKMARKS", items: vm.bookmarks)
                    homeSection(title: "WHAT'S NEW", items: vm.news)
                    homeSection(title: "TRENDING", items: vm.trends)
                }
            }
            .padding(.top, 20)
        }
        .navigationTitle("Home")
        .navigationBarTitleDisplayMode(.inline)
        .snackbar(message: $vm.snackbar)
        .task {
            await vm.loadAll(username: authManager.currentUser?.email ?? "")
        }
    }

    @ViewBuilder
    private func homeSection(title: String, items: [HomeItem]) -> some View {
        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 12) {
                Text(title)
                    .font(.caption.bold())
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 20)

                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(spacing: 12) {
                        ForEach(items) { item in
                            HomeCardView(item: item)
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
    }
}
```

**Step 4: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add home screen with bookmarks, news, and trends sections"
```

---

## Task 12: Cases Feature

**Files:**
- Create: `Features/Cases/ViewModels/CasesViewModel.swift`
- Create: `Features/Cases/Views/CasesListView.swift`
- Create: `Features/Cases/Views/CaseDetailView.swift`
- Create: `Features/Cases/Views/CaseFilterView.swift`

**Step 1: CasesViewModel**

`Features/Cases/ViewModels/CasesViewModel.swift`:
```swift
import SwiftUI

@MainActor
class CasesViewModel: ObservableObject {
    @Published var cases: [LegalCase] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var areasOfLaw: [AreaOfLaw] = []
    @Published var selectedCase: LegalCase?

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        guard !searchText.trimmed.isEmpty else { cases = []; return }
        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000) // debounce 0.5s
            guard !Task.isCancelled else { return }
            isLoading = true
            do { cases = try await APIClient.shared.request(.searchCases(term: searchText.trimmed)) } catch { cases = [] }
            isLoading = false
        }
    }

    func loadByArea(areaId: String) async {
        isLoading = true
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.casesByArea(areaId: areaId))
            cases = wrapper.data?.cases ?? []
        } catch { cases = [] }
        isLoading = false
    }

    func loadByYear(year: Int) async {
        isLoading = true
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.casesByYear(year: year))
            cases = wrapper.data?.cases ?? []
        } catch { cases = [] }
        isLoading = false
    }

    func loadCase(id: String) async {
        do {
            let wrapper: DataWrapper<CasesWrapper> = try await APIClient.shared.request(.loadCase(id: id))
            selectedCase = wrapper.data?.cases?.first
        } catch {}
    }

    func loadAreasOfLaw() async {
        do { areasOfLaw = try await APIClient.shared.request(.areasOfLaw) } catch {}
    }
}
```

**Step 2: CasesListView**

`Features/Cases/Views/CasesListView.swift`:
```swift
import SwiftUI

enum CaseFilterMode: String, CaseIterable {
    case search = "Search"
    case area = "By Area"
    case year = "By Year"
}

struct CasesListView: View {
    @StateObject private var vm = CasesViewModel()
    @State private var filterMode: CaseFilterMode = .search
    @State private var showFilter = false

    var body: some View {
        List {
            Picker("Filter", selection: $filterMode) {
                ForEach(CaseFilterMode.allCases, id: \.self) { Text($0.rawValue) }
            }
            .pickerStyle(.segmented)
            .listRowSeparator(.hidden)

            if vm.isLoading {
                ProgressView().frame(maxWidth: .infinity)
            } else if vm.cases.isEmpty && !vm.searchText.isEmpty {
                Text("No cases found").foregroundColor(.secondary)
            } else {
                ForEach(vm.cases) { legalCase in
                    NavigationLink(value: legalCase.id) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(legalCase.name ?? "Untitled Case")
                                .font(.headline)
                            if let highlight = legalCase.highlight {
                                Text(highlight).font(.caption).foregroundColor(.secondary).lineLimit(2)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
        .listStyle(.plain)
        .navigationTitle("Cases")
        .searchable(text: $vm.searchText, prompt: "Search cases")
        .onChange(of: vm.searchText) { _ in if filterMode == .search { vm.search() } }
        .sheet(isPresented: $showFilter) {
            CaseFilterView(vm: vm, filterMode: filterMode)
        }
        .toolbar {
            if filterMode != .search {
                Button(action: { showFilter = true }) {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                }
            }
        }
        .navigationDestination(for: String.self) { caseId in
            CaseDetailView(caseId: caseId)
        }
    }
}
```

**Step 3: CaseDetailView**

`Features/Cases/Views/CaseDetailView.swift`:
```swift
import SwiftUI

struct CaseDetailView: View {
    let caseId: String
    @StateObject private var vm = CasesViewModel()

    var body: some View {
        Group {
            if let c = vm.selectedCase {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(c.name ?? "").font(.title2.bold())

                        if let citation = c.citation {
                            Text([citation.name, citation.year, citation.volume, citation.page].compactMap { $0 }.joined(separator: " "))
                                .font(.subheadline).foregroundColor(.secondary)
                        }

                        if let plaintiffs = c.plaintiffs, !plaintiffs.isEmpty {
                            section("Plaintiffs", content: plaintiffs.compactMap(\.name).joined(separator: ", "))
                        }
                        if let defendants = c.defendants, !defendants.isEmpty {
                            section("Defendants", content: defendants.compactMap(\.name).joined(separator: ", "))
                        }
                        if let court = c.court?.name { section("Court", content: court) }
                        if let area = c.areaOfLaw?.name { section("Area of Law", content: area) }
                        if let facts = c.summaryOfFacts { section("Summary of Facts", content: facts) }
                        if let ruling = c.summaryOfRuling { section("Summary of Ruling", content: ruling) }
                        if let judgment = c.judgement { section("Judgment", content: judgment) }
                    }
                    .padding(20)
                }
            } else {
                ProgressView()
            }
        }
        .navigationTitle("Case Details")
        .navigationBarTitleDisplayMode(.inline)
        .task { await vm.loadCase(id: caseId) }
    }

    @ViewBuilder
    private func section(_ title: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).font(.caption.bold()).foregroundColor(.secondary)
            Text(content).font(.body)
        }
    }
}
```

**Step 4: CaseFilterView**

`Features/Cases/Views/CaseFilterView.swift`:
```swift
import SwiftUI

struct CaseFilterView: View {
    @ObservedObject var vm: CasesViewModel
    let filterMode: CaseFilterMode
    @Environment(\.dismiss) private var dismiss
    @State private var selectedYear = Calendar.current.component(.year, from: Date())

    var body: some View {
        NavigationStack {
            Group {
                switch filterMode {
                case .area:
                    List(vm.areasOfLaw) { area in
                        Button(area.name ?? "Unknown") {
                            Task { await vm.loadByArea(areaId: area._id ?? "") }
                            dismiss()
                        }
                    }
                case .year:
                    VStack {
                        Picker("Year", selection: $selectedYear) {
                            ForEach((1960...Calendar.current.component(.year, from: Date())).reversed(), id: \.self) { Text(String($0)) }
                        }
                        .pickerStyle(.wheel)
                        Button("Apply") {
                            Task { await vm.loadByYear(year: selectedYear) }
                            dismiss()
                        }
                        .buttonStyle(.borderedProminent)
                    }
                default:
                    EmptyView()
                }
            }
            .navigationTitle("Filter Cases")
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
        .task { if filterMode == .area { await vm.loadAreasOfLaw() } }
    }
}
```

**Step 5: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add cases feature with search, filter by area/year, and detail view"
```

---

## Task 13: Legislations Feature

**Files:**
- Create: `Features/Legislations/ViewModels/LegislationsViewModel.swift`
- Create: `Features/Legislations/Views/LegislationsListView.swift`
- Create: `Features/Legislations/Views/LegislationDetailView.swift`
- Create: `Features/Legislations/Views/LegislationFilterView.swift`

**Step 1: LegislationsViewModel**

`Features/Legislations/ViewModels/LegislationsViewModel.swift`:
```swift
import SwiftUI

@MainActor
class LegislationsViewModel: ObservableObject {
    @Published var legislations: [Legislation] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var selectedLegislation: Legislation?

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        guard !searchText.trimmed.isEmpty else { legislations = []; return }
        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000)
            guard !Task.isCancelled else { return }
            isLoading = true
            do { legislations = try await APIClient.shared.request(.searchLegislations(term: searchText.trimmed)) } catch { legislations = [] }
            isLoading = false
        }
    }

    func loadByVolume(volume: Int) async {
        isLoading = true
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.legislationsByVolume(volume: volume))
            legislations = wrapper.data?.legislations ?? []
        } catch { legislations = [] }
        isLoading = false
    }

    func loadByYear(year: Int, type: String) async {
        isLoading = true
        do {
            let wrapper: DataWrapper<LegislationsWrapper> = try await APIClient.shared.request(.legislationsByYear(year: year, type: type))
            legislations = wrapper.data?.legislations ?? []
        } catch { legislations = [] }
        isLoading = false
    }

    func loadLegislation(id: String) async {
        do {
            let wrapper: DataWrapper<LegislationWrapper> = try await APIClient.shared.request(.loadLegislation(id: id))
            selectedLegislation = wrapper.data?.legislation
        } catch {}
    }
}
```

**Step 2: LegislationsListView**

`Features/Legislations/Views/LegislationsListView.swift`:
```swift
import SwiftUI

struct LegislationsListView: View {
    @StateObject private var vm = LegislationsViewModel()

    var body: some View {
        List {
            if vm.isLoading {
                ProgressView().frame(maxWidth: .infinity)
            } else if vm.legislations.isEmpty && !vm.searchText.isEmpty {
                Text("No legislations found").foregroundColor(.secondary)
            } else {
                ForEach(vm.legislations) { legislation in
                    NavigationLink(value: legislation.id) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(legislation.legislationName ?? "Untitled")
                                .font(.headline)
                            HStack {
                                if let type = legislation.legislationType {
                                    Text(type).font(.caption).foregroundColor(.appBlue)
                                }
                                if let chapter = legislation.chapterNumber {
                                    Text("Ch. \(chapter)").font(.caption).foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
        .listStyle(.plain)
        .navigationTitle("Legislations")
        .searchable(text: $vm.searchText, prompt: "Search legislations")
        .onChange(of: vm.searchText) { _ in vm.search() }
        .navigationDestination(for: String.self) { id in
            LegislationDetailView(legislationId: id)
        }
    }
}
```

**Step 3: LegislationDetailView**

`Features/Legislations/Views/LegislationDetailView.swift`:
```swift
import SwiftUI

struct LegislationDetailView: View {
    let legislationId: String
    @StateObject private var vm = LegislationsViewModel()

    var body: some View {
        Group {
            if let leg = vm.selectedLegislation {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(leg.legislationName ?? "").font(.title2.bold())

                        if let type = leg.legislationType {
                            Text(type).font(.subheadline).foregroundColor(.appBlue)
                        }

                        if let preamble = leg.preamble, !preamble.isEmpty {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Preamble").font(.caption.bold()).foregroundColor(.secondary)
                                Text(preamble).font(.body)
                            }
                        }

                        if let parts = leg.legislationParts, !parts.isEmpty {
                            Text("Sections").font(.caption.bold()).foregroundColor(.secondary)
                            ForEach(parts) { part in
                                LegislationPartView(part: part)
                            }
                        }
                    }
                    .padding(20)
                }
            } else {
                ProgressView()
            }
        }
        .navigationTitle("Legislation")
        .navigationBarTitleDisplayMode(.inline)
        .task { await vm.loadLegislation(id: legislationId) }
    }
}

struct LegislationPartView: View {
    let part: LegislationPart

    var body: some View {
        DisclosureGroup {
            VStack(alignment: .leading, spacing: 8) {
                if let content = part.content {
                    Text(content).font(.body)
                }
                if let children = part.children {
                    ForEach(children) { child in
                        LegislationPartView(part: child)
                    }
                }
            }
            .padding(.leading, 8)
        } label: {
            Text(part.title ?? "Section")
                .font(.subheadline.bold())
        }
    }
}
```

**Step 4: LegislationFilterView stub**

`Features/Legislations/Views/LegislationFilterView.swift`:
```swift
import SwiftUI

struct LegislationFilterView: View {
    @ObservedObject var vm: LegislationsViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var selectedVolume = 1
    @State private var selectedYear = Calendar.current.component(.year, from: Date())
    @State private var selectedType = "Acts"

    var body: some View {
        NavigationStack {
            Form {
                Section("By Volume") {
                    Picker("Volume", selection: $selectedVolume) {
                        ForEach(1...12, id: \.self) { Text("Volume \($0)").tag($0) }
                    }
                    Button("Filter by Volume") {
                        Task { await vm.loadByVolume(volume: selectedVolume) }
                        dismiss()
                    }
                }

                Section("By Year") {
                    Picker("Type", selection: $selectedType) {
                        ForEach(["Acts", "Statutory Instruments"], id: \.self) { Text($0) }
                    }
                    Picker("Year", selection: $selectedYear) {
                        ForEach((1960...Calendar.current.component(.year, from: Date())).reversed(), id: \.self) { Text(String($0)) }
                    }
                    Button("Filter by Year") {
                        Task { await vm.loadByYear(year: selectedYear, type: selectedType) }
                        dismiss()
                    }
                }
            }
            .navigationTitle("Filter Legislations")
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
    }
}
```

**Step 5: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add legislations feature with search, filters, and collapsible detail view"
```

---

## Task 14: Search Feature

**Files:**
- Create: `Features/Search/ViewModels/SearchViewModel.swift`
- Create: `Features/Search/Views/GlobalSearchView.swift`

**Step 1: SearchViewModel**

`Features/Search/ViewModels/SearchViewModel.swift`:
```swift
import SwiftUI

@MainActor
class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var cases: [LegalCase] = []
    @Published var legislations: [Legislation] = []
    @Published var isLoading = false

    private var searchTask: Task<Void, Never>?

    func search() {
        searchTask?.cancel()
        guard !searchText.trimmed.isEmpty else { cases = []; legislations = []; return }
        searchTask = Task {
            try? await Task.sleep(nanoseconds: 500_000_000)
            guard !Task.isCancelled else { return }
            isLoading = true
            async let c: [LegalCase] = APIClient.shared.request(.searchCases(term: searchText.trimmed))
            async let l: [Legislation] = APIClient.shared.request(.searchLegislations(term: searchText.trimmed))
            cases = (try? await c) ?? []
            legislations = (try? await l) ?? []
            isLoading = false
        }
    }
}
```

**Step 2: GlobalSearchView**

`Features/Search/Views/GlobalSearchView.swift`:
```swift
import SwiftUI

struct GlobalSearchView: View {
    @StateObject private var vm = SearchViewModel()

    var body: some View {
        List {
            if vm.isLoading {
                ProgressView().frame(maxWidth: .infinity)
            } else {
                if !vm.cases.isEmpty {
                    Section("Cases (\(vm.cases.count))") {
                        ForEach(vm.cases) { c in
                            NavigationLink(value: c.id) {
                                Text(c.name ?? "Untitled").font(.subheadline)
                            }
                        }
                    }
                }
                if !vm.legislations.isEmpty {
                    Section("Legislations (\(vm.legislations.count))") {
                        ForEach(vm.legislations) { l in
                            Text(l.legislationName ?? "Untitled").font(.subheadline)
                        }
                    }
                }
                if vm.cases.isEmpty && vm.legislations.isEmpty && !vm.searchText.isEmpty {
                    Text("No results found").foregroundColor(.secondary)
                }
            }
        }
        .listStyle(.plain)
        .navigationTitle("Search")
        .searchable(text: $vm.searchText, prompt: "Search cases & legislations")
        .onChange(of: vm.searchText) { _ in vm.search() }
    }
}
```

**Step 3: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add global search across cases and legislations"
```

---

## Task 15: Chat Feature

**Files:**
- Create: `Features/Chat/ViewModels/ChatViewModel.swift`
- Create: `Features/Chat/Views/ChatView.swift`
- Create: `Features/Chat/Views/ChatMessageView.swift`
- Create: `Features/Chat/Views/ChatSidebarView.swift`

**Step 1: ChatViewModel with SSE streaming**

`Features/Chat/ViewModels/ChatViewModel.swift`:
```swift
import SwiftUI

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var threads: [ChatThread] = []
    @Published var currentThreadId: String?
    @Published var inputText = ""
    @Published var isStreaming = false

    private var streamTask: Task<Void, Never>?

    func sendMessage() {
        let question = inputText.trimmed
        guard !question.isEmpty, !isStreaming else { return }
        inputText = ""
        messages.append(ChatMessage(text: question, isUser: true))
        messages.append(ChatMessage(text: "", isUser: false))

        isStreaming = true
        streamTask = Task { await streamResponse(question: question) }
    }

    private func streamResponse(question: String) async {
        let token = KeychainService.load(key: "accessToken")
        let endpoint = Endpoint.askAI(question: question, threadId: currentThreadId, accessToken: token)

        do {
            let request = try await APIClient.shared.streamRequest(endpoint)
            let (bytes, response) = try await URLSession.shared.bytes(for: request)

            guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
                appendToLastAssistant("Failed to get response.")
                isStreaming = false
                return
            }

            var buffer = ""
            for try await byte in bytes {
                buffer.append(Character(UnicodeScalar(byte)))
                while let eventEnd = buffer.range(of: "\n\n") {
                    let eventBlock = String(buffer[buffer.startIndex..<eventEnd.lowerBound])
                    buffer.removeSubrange(buffer.startIndex...eventEnd.upperBound)
                    processSSEEvent(eventBlock)
                }
            }
            if !buffer.trimmed.isEmpty { processSSEEvent(buffer) }
        } catch {
            appendToLastAssistant("Connection error.")
        }
        isStreaming = false
    }

    private func processSSEEvent(_ block: String) {
        var eventType = "message"
        var dataLines: [String] = []

        for line in block.components(separatedBy: "\n") {
            if line.hasPrefix("event:") { eventType = line.dropFirst(6).trimmed }
            else if line.hasPrefix("data:") { dataLines.append(String(line.dropFirst(5)).trimmed) }
            else if line == "[DONE]" { return }
        }

        let data = dataLines.joined(separator: "\n")
        guard !data.isEmpty, let json = try? JSONSerialization.jsonObject(with: Data(data.utf8)) as? [String: Any] else { return }

        switch eventType {
        case "token":
            if let text = json["text"] as? String { appendToLastAssistant(text) }
        case "metadata":
            if let sources = json["sources"] as? [[String: Any]] {
                let refs = sources.compactMap { s -> ChatReference? in
                    guard let source = s["source"] as? String, let id = s["id"] as? String,
                          let type = s["type"] as? String, let title = s["title"] as? String else { return nil }
                    return ChatReference(source: source, sourceId: id, type: type, title: title)
                }
                if !messages.isEmpty { messages[messages.count - 1].references = refs }
            }
        case "done":
            if let thread = json["thread"] as? [String: Any], let id = thread["id"] as? String {
                currentThreadId = id
            }
        case "error":
            if let msg = json["message"] as? String { appendToLastAssistant("\nError: \(msg)") }
        default: break
        }
    }

    private func appendToLastAssistant(_ text: String) {
        guard !messages.isEmpty else { return }
        messages[messages.count - 1].text += text
    }

    func loadThreads() async {
        do { let response: ChatThreadsResponse = try await APIClient.shared.request(.chatThreads); threads = response.threads ?? [] } catch {}
    }

    func startNewThread() {
        currentThreadId = nil
        messages = []
    }
}
```

**Step 2: ChatMessageView**

`Features/Chat/Views/ChatMessageView.swift`:
```swift
import SwiftUI

struct ChatMessageView: View {
    let message: ChatMessage

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            if message.isUser { Spacer(minLength: 60) }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 8) {
                Text(message.text)
                    .padding(12)
                    .background(message.isUser ? Color.black : Color(.systemGray6))
                    .foregroundColor(message.isUser ? .white : .primary)
                    .cornerRadius(16)

                if !message.references.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(message.references) { ref in
                            HStack(spacing: 4) {
                                Image(systemName: ref.type == "case" ? "book.closed" : "doc.text")
                                    .font(.caption2)
                                Text(ref.title)
                                    .font(.caption2)
                                    .lineLimit(1)
                            }
                            .foregroundColor(.appBlue)
                        }
                    }
                }
            }

            if !message.isUser { Spacer(minLength: 60) }
        }
        .padding(.horizontal, 16)
    }
}
```

**Step 3: ChatSidebarView**

`Features/Chat/Views/ChatSidebarView.swift`:
```swift
import SwiftUI

struct ChatSidebarView: View {
    @ObservedObject var vm: ChatViewModel
    @Binding var isOpen: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Chat History")
                    .font(.headline)
                Spacer()
                Button(action: { vm.startNewThread(); isOpen = false }) {
                    Image(systemName: "plus.circle")
                }
            }
            .padding()

            if vm.threads.isEmpty {
                Text("No conversations yet")
                    .foregroundColor(.secondary)
                    .padding()
            } else {
                List(vm.threads) { thread in
                    Button(action: {
                        vm.currentThreadId = thread.id
                        vm.messages = []
                        isOpen = false
                    }) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(thread.title ?? "Untitled")
                                .font(.subheadline.bold())
                                .lineLimit(1)
                            if let last = thread.lastQuestion {
                                Text(last).font(.caption).foregroundColor(.secondary).lineLimit(1)
                            }
                        }
                    }
                }
                .listStyle(.plain)
            }
        }
    }
}
```

**Step 4: ChatView**

`Features/Chat/Views/ChatView.swift`:
```swift
import SwiftUI

struct ChatView: View {
    @StateObject private var vm = ChatViewModel()
    @State private var showSidebar = false

    var body: some View {
        ZStack(alignment: .leading) {
            VStack(spacing: 0) {
                HStack {
                    Button(action: { withAnimation { showSidebar.toggle() } }) {
                        Image(systemName: "sidebar.left")
                    }
                    Spacer()
                    Text("Ask AI").font(.headline)
                    Spacer()
                    Button(action: { vm.startNewThread() }) {
                        Image(systemName: "plus")
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 10)

                Divider()

                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(vm.messages) { msg in
                                ChatMessageView(message: msg)
                                    .id(msg.id)
                            }
                        }
                        .padding(.vertical, 16)
                    }
                    .onChange(of: vm.messages.count) { _ in
                        if let last = vm.messages.last {
                            withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                        }
                    }
                }

                Divider()

                HStack(spacing: 8) {
                    TextField("Ask a question...", text: $vm.inputText, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(1...4)

                    Button(action: { vm.sendMessage() }) {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.title2)
                    }
                    .disabled(vm.inputText.trimmed.isEmpty || vm.isStreaming)
                }
                .padding(12)
            }

            if showSidebar {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture { withAnimation { showSidebar = false } }

                ChatSidebarView(vm: vm, isOpen: $showSidebar)
                    .frame(width: 280)
                    .background(Color(.systemBackground))
                    .transition(.move(edge: .leading))
            }
        }
        .task { await vm.loadThreads() }
    }
}
```

**Step 5: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add AI chat with SSE streaming, thread history, and references"
```

---

## Task 16: Settings Feature

**Files:**
- Create: `Features/Settings/Views/SettingsView.swift`
- Create: `Features/Settings/ViewModels/SettingsViewModel.swift`

**Step 1: SettingsView**

`Features/Settings/Views/SettingsView.swift`:
```swift
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var appState: AppState

    var body: some View {
        Form {
            Section("Profile") {
                LabeledContent("Name", value: authManager.currentUser?.fullName ?? "—")
                LabeledContent("Email", value: authManager.currentUser?.email ?? "—")
                LabeledContent("Role", value: authManager.currentUser?.role ?? "—")
            }

            Section("Subscription") {
                NavigationLink("Manage Subscription") {
                    SubscriptionView()
                }
            }

            Section("Legal") {
                NavigationLink("Terms of Service") {
                    LegislationDetailView(legislationId: "5badf52b4594190056063cae")
                }
                NavigationLink("Privacy Policy") {
                    LegislationDetailView(legislationId: "5badec9d1a2fa200672d9abe")
                }
            }

            Section {
                Button("Log Out", role: .destructive) {
                    authManager.clearSession()
                    appState.currentFlow = .auth
                }
            }
        }
        .navigationTitle("Settings")
    }
}
```

**Step 2: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add settings screen with profile, subscription, and logout"
```

---

## Task 17: Subscription Feature (StoreKit 2)

**Files:**
- Create: `Features/Subscription/ViewModels/SubscriptionViewModel.swift`
- Create: `Features/Subscription/Views/SubscriptionView.swift`
- Create: `Features/Subscription/Views/PaymentOptionsView.swift`

**Step 1: SubscriptionViewModel**

`Features/Subscription/ViewModels/SubscriptionViewModel.swift`:
```swift
import SwiftUI
import StoreKit

@MainActor
class SubscriptionViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isSubscribed = false
    @Published var isLoading = false
    @Published var snackbar: SnackbarMessage?

    private let productId = "apptorney_subs"

    func loadProducts() async {
        do {
            products = try await Product.products(for: [productId])
        } catch {
            snackbar = SnackbarMessage(text: "Failed to load products.")
        }
    }

    func purchase() async {
        guard let product = products.first else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                isSubscribed = true
                snackbar = SnackbarMessage(text: "Subscription activated!", isError: false)
            case .userCancelled:
                break
            case .pending:
                snackbar = SnackbarMessage(text: "Purchase pending approval.")
            @unknown default:
                break
            }
        } catch {
            snackbar = SnackbarMessage(text: "Purchase failed. Please try again.")
        }
    }

    func checkSubscriptionStatus() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result, transaction.productID == productId {
                isSubscribed = true
                return
            }
        }
        isSubscribed = false
    }

    func restorePurchases() async {
        try? await AppStore.sync()
        await checkSubscriptionStatus()
    }

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified: throw AppError.unknown("Unverified transaction")
        case .verified(let safe): return safe
        }
    }
}
```

**Step 2: SubscriptionView**

`Features/Subscription/Views/SubscriptionView.swift`:
```swift
import SwiftUI

struct SubscriptionView: View {
    @StateObject private var vm = SubscriptionViewModel()

    var body: some View {
        VStack(spacing: 24) {
            if vm.isSubscribed {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.green)
                Text("Subscription Active")
                    .font(.title2.bold())
            } else {
                Image(systemName: "star.circle")
                    .font(.system(size: 60))
                    .foregroundColor(.appBlue)
                Text("Subscribe to Apptorney")
                    .font(.title2.bold())
                Text("Get unlimited access to case law, legislations, and AI features.")
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 40)

                if let product = vm.products.first {
                    Text(product.displayPrice + " / " + (product.subscription?.subscriptionPeriod.debugDescription ?? "period"))
                        .font(.headline)
                }

                Button(action: { Task { await vm.purchase() } }) {
                    HStack {
                        Text(vm.isLoading ? "Processing..." : "Subscribe")
                            .font(.headline)
                        if vm.isLoading { ProgressView().tint(.white) }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.black)
                    .cornerRadius(10)
                }
                .padding(.horizontal, 20)
                .disabled(vm.isLoading)

                Button("Restore Purchases") {
                    Task { await vm.restorePurchases() }
                }
                .foregroundColor(.gray)
            }
        }
        .snackbar(message: $vm.snackbar)
        .navigationTitle("Subscription")
        .task {
            await vm.loadProducts()
            await vm.checkSubscriptionStatus()
        }
    }
}
```

**Step 3: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add subscription feature with StoreKit 2"
```

---

## Task 18: Wire Up Home + Chat Toggle

**Files:**
- Modify: `Features/Home/Views/HomeView.swift`

**Step 1:** Add a chat toggle button to HomeView that presents ChatView as a sheet or inline:

Add to HomeView toolbar:
```swift
.toolbar {
    ToolbarItem(placement: .navigationBarTrailing) {
        NavigationLink(destination: ChatView()) {
            Image(systemName: "bubble.left.and.bubble.right")
        }
    }
}
```

**Step 2: Build, commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: wire chat access from home screen toolbar"
```

---

## Task 19: Create Xcode Project File

Since we can't use `xcodebuild` to create a project from scratch via CLI, create the project using a generation tool or manually.

**Step 1:** Install `xcodegen` if not present:
```bash
brew install xcodegen
```

**Step 2:** Create `ios-app-swiftui/apptorney/project.yml`:
```yaml
name: apptorney
options:
  bundleIdPrefix: com.apptorney
  deploymentTarget:
    iOS: "16.0"
  xcodeVersion: "16.2"
settings:
  base:
    SWIFT_VERSION: "5.9"
    TARGETED_DEVICE_FAMILY: "1,2"
targets:
  apptorney:
    type: application
    platform: iOS
    sources:
      - path: apptorney
    settings:
      base:
        INFOPLIST_FILE: apptorney/Info.plist
        PRODUCT_BUNDLE_IDENTIFIER: com.apptorney.swiftui
        MARKETING_VERSION: "1.0.0"
        CURRENT_PROJECT_VERSION: 1
```

**Step 3:** Create `Info.plist`:
```bash
cat > ios-app-swiftui/apptorney/apptorney/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Apptorney</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>UILaunchScreen</key>
    <dict/>
</dict>
</plist>
EOF
```

**Step 4:** Generate the project:
```bash
cd ios-app-swiftui/apptorney && xcodegen generate
```

**Step 5:** Build:
```bash
xcodebuild -project apptorney.xcodeproj -scheme apptorney -destination 'platform=iOS Simulator,name=iPhone 16 Pro,OS=18.2' -sdk iphonesimulator build
```

**Step 6: Commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: add Xcode project via xcodegen with iOS 16+ target"
```

---

## Task 20: Final Integration & Build Verification

**Step 1:** Ensure all views compile together. Fix any type mismatches or missing imports.

**Step 2:** Run in simulator:
```bash
xcodebuild -project apptorney.xcodeproj -scheme apptorney -destination 'platform=iOS Simulator,name=iPhone 16 Pro,OS=18.2' -sdk iphonesimulator build
xcrun simctl install booted apptorney.app
xcrun simctl launch booted com.apptorney.swiftui
```

**Step 3:** Take screenshots to verify each screen.

**Step 4: Final commit**
```bash
git add ios-app-swiftui/
git commit -m "feat: complete SwiftUI app with full feature parity"
```
