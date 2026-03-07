
import Foundation
import Alamofire
import SwiftyJSON

protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {

    static let urlBase = "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api"
    static let appUsersURL = urlBase + "/appusers"
    static let casesURL = urlBase + "/cases"

    // Storage keys
    static let authTokenStorageKey = "auth_access_token"
    static let authRefreshTokenKey = "auth_refresh_token"
    static let authUserIdStorageKey = "auth_user_id"
    static let authUserEmailKey = "auth_user_email"
    static let authUserNameKey = "auth_user_name"
    static let authUserRoleKey = "auth_user_role"

    weak var delegate: APIServiceDelegate?

    // MARK: - Session persistence

    static func persistSession(accessToken: String, refreshToken: String, userId: String, email: String, userName: String, role: String) {
        let defaults = UserDefaults.standard
        defaults.set(accessToken, forKey: authTokenStorageKey)
        defaults.set(refreshToken, forKey: authRefreshTokenKey)
        defaults.set(userId, forKey: authUserIdStorageKey)
        defaults.set(email, forKey: authUserEmailKey)
        defaults.set(userName, forKey: authUserNameKey)
        defaults.set(role, forKey: authUserRoleKey)
        defaults.synchronize()
    }

    static func clearSession() {
        let defaults = UserDefaults.standard
        let keys = [authTokenStorageKey, authRefreshTokenKey, authUserIdStorageKey,
                    authUserEmailKey, authUserNameKey, authUserRoleKey,
                    "access_token", "accessToken", "token", "id", "userId"]
        for key in keys {
            defaults.removeObject(forKey: key)
        }
        defaults.set(false, forKey: "loginComplete")
        defaults.synchronize()
    }

    static func hasValidAuthSession() -> Bool {
        let defaults = UserDefaults.standard
        let token = defaults.string(forKey: authTokenStorageKey) ?? ""
        return token.count >= 12
    }

    static func storedAccessToken() -> String? {
        let token = UserDefaults.standard.string(forKey: authTokenStorageKey) ?? ""
        return token.count >= 12 ? token : nil
    }

    static func storedRefreshToken() -> String? {
        let token = UserDefaults.standard.string(forKey: authRefreshTokenKey) ?? ""
        return token.count >= 12 ? token : nil
    }

    // MARK: - Token refresh

    static func refreshAccessToken(completionHandler: @escaping (Bool) -> Void) {
        guard let refreshToken = storedRefreshToken() else {
            completionHandler(false)
            return
        }

        let headers: HTTPHeaders = [
            "Content-Type": "application/json",
            "Accept": "application/json"
        ]

        Alamofire.request(
            urlBase + "/auth/refresh",
            method: .post,
            parameters: ["refreshToken": refreshToken],
            encoding: JSONEncoding.default,
            headers: headers
        ).responseJSON { response in
            switch response.result {
            case .success:
                if let dict = response.result.value as? [String: Any],
                   let newToken = dict["accessToken"] as? String, newToken.count >= 12 {
                    UserDefaults.standard.set(newToken, forKey: authTokenStorageKey)
                    UserDefaults.standard.synchronize()
                    completionHandler(true)
                } else {
                    completionHandler(false)
                }
            case .failure:
                completionHandler(false)
            }
        }
    }

    // MARK: - Headers

    private func defaultHeaders(extra: [String: String] = [:]) -> [String: String] {
        var headers: [String: String] = [
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953",
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b"
        ]
        if let token = APIService.storedAccessToken() {
            headers["Authorization"] = "Bearer \(token)"
        }
        for (key, value) in extra {
            headers[key] = value
        }
        return headers
    }

    // MARK: - HTTP Methods

    func get(endPoint: String, parameters: Any?, completionHandler: @escaping (Data?, Error?) -> Void) {
        let headers = defaultHeaders()
        if let parameters: Parameters = parameters as? Parameters {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseData { response in
                switch response.result {
                case .success:
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    completionHandler(nil, error)
                }
            }
        } else {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, headers: headers).validate().responseData { response in
                switch response.result {
                case .success:
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    completionHandler(nil, error)
                }
            }
        }
    }

    func getAsJSON(endPoint: String, parameters: Any, completionHandler: @escaping (Any?, Error?) -> Void) {
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()

        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseJSON { response in
            switch response.result {
            case .success:
                if let data = response.result.value {
                    completionHandler(data, nil)
                }
            case .failure(let error):
                completionHandler(nil, error)
            }
        }
    }

    func post(endPoint: String, parameters: Any, completionHandler: @escaping (Any?, Error?) -> Void) {
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()

        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers: headers).validate().responseJSON { response in
            switch response.result {
            case .success:
                if let data = response.result.value {
                    completionHandler(data, nil)
                }
            case .failure(let error):
                completionHandler(nil, error)
            }
        }
    }

    func postJSON(endPoint: String, parameters: Any, completionHandler: @escaping (Any?, Error?) -> Void) {
        let parameters: Parameters = parameters as! Parameters
        let headers: HTTPHeaders = defaultHeaders(extra: ["Content-Type": "application/json"])

        Alamofire.request(
            APIService.urlBase + endPoint,
            method: .post,
            parameters: parameters,
            encoding: JSONEncoding.default,
            headers: headers
        )
        .validate()
        .responseJSON { response in
            switch response.result {
            case .success:
                if let data = response.result.value {
                    completionHandler(data, nil)
                }
            case .failure(let error):
                completionHandler(nil, error)
            }
        }
    }

    func postWithResponseFormat(endPoint: String, parameters: Any, completionHandler: @escaping (Data?, Error?) -> Void) {
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()

        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers: headers).responseData { response in
            switch response.result {
            case .success:
                if let data = response.result.value {
                    completionHandler(data, nil)
                }
            case .failure(let error):
                completionHandler(nil, error)
            }
        }
    }

    func put() {
    }

    func delete() {
    }
}
