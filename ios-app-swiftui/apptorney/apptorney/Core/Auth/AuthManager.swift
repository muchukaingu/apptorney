import SwiftUI

@MainActor
class AuthManager: ObservableObject {
    @Published var currentUser: User?
    @Published var isAuthenticated = false

    private static let accessTokenKey = "accessToken"
    private static let refreshTokenKey = "refreshToken"
    private static let userIdKey = "userId"
    private static let emailKey = "email"
    private static let userNameKey = "userName"
    private static let roleKey = "role"

    init() {
        isAuthenticated = AuthManager.hasValidSession()
    }

    // MARK: - Session Check

    static func hasValidSession() -> Bool {
        guard let token = KeychainService.load(key: accessTokenKey) else { return false }
        return token.count >= 12
    }

    // MARK: - Auth Actions

    func login(email: String) async throws {
        try await APIClient.shared.requestVoid(.login(email: email))
    }

    func register(email: String, firstName: String, lastName: String, phoneNumber: String?, organization: String?) async throws {
        try await APIClient.shared.requestVoid(.register(
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            organization: organization
        ))
    }

    func verifyOtp(email: String, otp: String) async throws {
        struct VerifyResponse: Codable {
            var accessToken: String?
            var refreshToken: String?
            var user: User?
        }

        let response: VerifyResponse = try await APIClient.shared.request(.verifyOtp(email: email, otp: otp))

        guard let accessToken = response.accessToken,
              let refreshToken = response.refreshToken else {
            throw AppError.unknown("Invalid response from server.")
        }

        let user = response.user
        persistSession(
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: user?._id,
            email: user?.email,
            userName: user?.fullName,
            role: user?.role
        )

        currentUser = user
        isAuthenticated = true
        UserDefaults.standard.set(true, forKey: "loginComplete")
    }

    func resendOtp(email: String) async throws {
        try await login(email: email)
    }

    func refreshAccessToken() async -> Bool {
        guard let refreshToken = KeychainService.load(key: AuthManager.refreshTokenKey) else {
            return false
        }

        struct RefreshResponse: Codable {
            var accessToken: String?
        }

        do {
            let response: RefreshResponse = try await APIClient.shared.request(.refreshToken(refreshToken: refreshToken))
            if let newToken = response.accessToken, newToken.count >= 12 {
                KeychainService.save(key: AuthManager.accessTokenKey, value: newToken)
                return true
            }
            return false
        } catch {
            return false
        }
    }

    // MARK: - Session Persistence

    func persistSession(
        accessToken: String,
        refreshToken: String,
        userId: String? = nil,
        email: String? = nil,
        userName: String? = nil,
        role: String? = nil
    ) {
        KeychainService.save(key: AuthManager.accessTokenKey, value: accessToken)
        KeychainService.save(key: AuthManager.refreshTokenKey, value: refreshToken)
        if let userId { KeychainService.save(key: AuthManager.userIdKey, value: userId) }
        if let email { KeychainService.save(key: AuthManager.emailKey, value: email) }
        if let userName { KeychainService.save(key: AuthManager.userNameKey, value: userName) }
        if let role { KeychainService.save(key: AuthManager.roleKey, value: role) }
    }

    func clearSession() {
        KeychainService.delete(key: AuthManager.accessTokenKey)
        KeychainService.delete(key: AuthManager.refreshTokenKey)
        KeychainService.delete(key: AuthManager.userIdKey)
        KeychainService.delete(key: AuthManager.emailKey)
        KeychainService.delete(key: AuthManager.userNameKey)
        KeychainService.delete(key: AuthManager.roleKey)
        currentUser = nil
        isAuthenticated = false
        UserDefaults.standard.set(false, forKey: "loginComplete")
    }
}
