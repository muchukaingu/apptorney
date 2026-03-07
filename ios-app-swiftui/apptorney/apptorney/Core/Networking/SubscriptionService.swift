import Foundation

enum SubscriptionService {
    static func checkForUpdate() async -> Bool {
        let currentVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0.0"
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "1"
        let fullVersion = "\(currentVersion).\(build)"

        do {
            let response: APIResponse = try await APIClient.shared.request(.checkForUpdate(version: fullVersion))
            return response.data == "update"
        } catch {
            return false
        }
    }

    static func checkSubscription() async -> Bool {
        let userName = UserDefaults.standard.string(forKey: "auth_user_email") ?? ""
        guard !userName.isEmpty else { return false }

        do {
            let response: APIResponse = try await APIClient.shared.request(.checkSubscription(userName: userName))
            return response.statusCode == 200
        } catch {
            return false
        }
    }
}
