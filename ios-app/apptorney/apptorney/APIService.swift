
import Foundation
import Alamofire
import SwiftyJSON



protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {
    
    //static let urlBase          = "http://localhost:3009/api" //production
    //static let urlBase          = "http://api.backend.apptorney.org/api" //production
    static let urlBase          = "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api" //production
   // static let urlBase          = "https://apptorney-backend-test.eu-gb.mybluemix.net/api" //test
    static let appUsersURL      = urlBase + "/appusers"
    static let casesURL         = urlBase + "/cases"
    static let authTokenStorageKey = "auth_access_token"
    static let authUserIdStorageKey = "auth_user_id"
    weak var delegate: APIServiceDelegate?

    private func normalizedToken(_ value: Any?) -> String {
        guard let value = value else { return "" }
        if let text = value as? String {
            return text.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if let number = value as? NSNumber {
            return number.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return "\(value)".trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func isPlausibleToken(_ token: String) -> Bool {
        let trimmed = token.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.count < 12 { return false }
        if trimmed.contains("{") || trimmed.contains("}") { return false }
        if trimmed.contains(" ") || trimmed.contains("\n") || trimmed.contains("\t") { return false }
        if trimmed.lowercased().hasPrefix("optional(") { return false }
        return true
    }

    private func tokenFromNestedPayload(_ value: Any?) -> String {
        if let dict = value as? [String: Any] {
            let directCandidates: [Any?] = [
                dict["id"],
                dict["token"],
                dict["accessToken"],
                dict["access_token"]
            ]
            for candidate in directCandidates {
                if let nested = candidate as? [String: Any] {
                    let nestedToken = tokenFromNestedPayload(nested)
                    if isPlausibleToken(nestedToken) {
                        return nestedToken
                    }
                    continue
                }

                let token = normalizedToken(candidate)
                if isPlausibleToken(token) {
                    return token
                }
            }

            let wrappedCandidates: [Any?] = [
                dict["data"],
                dict["result"],
                dict["response"],
                dict["payload"]
            ]
            for wrapped in wrappedCandidates {
                let token = tokenFromNestedPayload(wrapped)
                if isPlausibleToken(token) {
                    return token
                }
            }
        }

        if let array = value as? [Any] {
            for item in array {
                let token = tokenFromNestedPayload(item)
                if isPlausibleToken(token) {
                    return token
                }
            }
        }

        let token = normalizedToken(value)
        return isPlausibleToken(token) ? token : ""
    }

    private func userIdFromNestedPayload(_ value: Any?) -> String {
        if let dict = value as? [String: Any] {
            let directCandidates: [Any?] = [
                dict["userId"],
                dict["user_id"]
            ]
            for candidate in directCandidates {
                let userId = normalizedToken(candidate)
                if !userId.isEmpty {
                    return userId
                }
            }

            let wrappedCandidates: [Any?] = [
                dict["data"],
                dict["result"],
                dict["response"],
                dict["payload"],
                dict["token"],
                dict["accessToken"]
            ]
            for wrapped in wrappedCandidates {
                let userId = userIdFromNestedPayload(wrapped)
                if !userId.isEmpty {
                    return userId
                }
            }
        }

        return ""
    }

    private func tokenFromCookieHeader(_ setCookieHeader: String) -> String {
        let parts = setCookieHeader.components(separatedBy: ";")
        for rawPart in parts {
            let part = rawPart.trimmingCharacters(in: .whitespacesAndNewlines)
            if part.lowercased().hasPrefix("access_token=") {
                let token = String(part.dropFirst("access_token=".count)).trimmingCharacters(in: .whitespacesAndNewlines)
                if isPlausibleToken(token) {
                    return token
                }
            }
        }
        return ""
    }

    private func tokenFromResponseHeaders(_ httpResponse: HTTPURLResponse?) -> String {
        guard let httpResponse = httpResponse else { return "" }
        var stringHeaders: [String: String] = [:]
        for (key, value) in httpResponse.allHeaderFields {
            stringHeaders["\(key)"] = "\(value)"
        }

        if let url = httpResponse.url {
            let cookies = HTTPCookie.cookies(withResponseHeaderFields: stringHeaders, for: url)
            if let cookie = cookies.first(where: { $0.name.lowercased() == "access_token" }) {
                let token = normalizedToken(cookie.value)
                if isPlausibleToken(token) {
                    return token
                }
            }
        }

        for (headerKey, value) in stringHeaders where headerKey.caseInsensitiveCompare("Set-Cookie") == .orderedSame {
            let token = tokenFromCookieHeader(value)
            if isPlausibleToken(token) {
                return token
            }
        }

        for (headerKey, value) in stringHeaders where headerKey.caseInsensitiveCompare("Authorization") == .orderedSame {
            let normalized = value.trimmingCharacters(in: .whitespacesAndNewlines)
            if normalized.lowercased().hasPrefix("bearer ") {
                let token = String(normalized.dropFirst("bearer ".count)).trimmingCharacters(in: .whitespacesAndNewlines)
                if isPlausibleToken(token) {
                    return token
                }
            }
            if isPlausibleToken(normalized) {
                return normalized
            }
        }

        return ""
    }

    private func persistAuthToken(_ token: String, userId: String?) {
        guard isPlausibleToken(token) else { return }
        let defaults = UserDefaults.standard
        defaults.set(token, forKey: APIService.authTokenStorageKey)
        defaults.set(token, forKey: "access_token")
        defaults.set(token, forKey: "accessToken")
        defaults.set(token, forKey: "token")
        defaults.set(token, forKey: "id")
        if let userId = userId?.trimmingCharacters(in: .whitespacesAndNewlines), !userId.isEmpty {
            defaults.set(userId, forKey: APIService.authUserIdStorageKey)
            defaults.set(userId, forKey: "userId")
        }
        defaults.synchronize()
    }

    private func persistAccessToken(from response: Any?, httpResponse: HTTPURLResponse?) {
        let tokenFromBody = tokenFromNestedPayload(response)
        let token = isPlausibleToken(tokenFromBody) ? tokenFromBody : tokenFromResponseHeaders(httpResponse)
        let userId = userIdFromNestedPayload(response)
        persistAuthToken(token, userId: userId)
    }

    private func authToken() -> String? {
        let defaults = UserDefaults.standard
        let keys = [APIService.authTokenStorageKey, "access_token", "accessToken", "token", "id"]
        for key in keys {
            let value = normalizedToken(defaults.object(forKey: key))
            if isPlausibleToken(value) {
                return value
            }
        }

        if let cookies = HTTPCookieStorage.shared.cookies {
            if let cookie = cookies.first(where: { $0.name.lowercased() == "access_token" }) {
                let token = normalizedToken(cookie.value)
                if isPlausibleToken(token) {
                    persistAuthToken(token, userId: nil)
                    return token
                }
            }
        }

        return nil
    }

    private func defaultHeaders(extra: [String: String] = [:]) -> [String: String] {
        var headers: [String: String] = [
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953",
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b"
        ]
        if let token = authToken() {
            headers["Authorization"] = "Bearer \(token)"
            headers["X-Access-Token"] = token
        }
        for (key, value) in extra {
            headers[key] = value
        }
        return headers
    }
    
    func get(endPoint:String, parameters:Any?, completionHandler:@escaping (Data?, Error?)->Void){
        let headers = defaultHeaders()
        if let parameters: Parameters = parameters as? Parameters {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseData { response in
                
                switch response.result {
                case .success:
                    print("Validation Successful")
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    print(response.result.value)
                    completionHandler(nil, error)
                    
                }
                
            }
        } else {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, headers: headers).validate().responseData { response in
                
                switch response.result {
                case .success:
                    print("Validation Successful")
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    print(response.result.value)
                    completionHandler(nil, error)
                    
                }
                
            }
        }
       
        

       
    }
    
    
    func getAsJSON(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()
        
        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseJSON { response in
            print(response)
            
            
            switch response.result {
            case .success:
                //print("Validation Successful")
                if let data = response.result.value {
                    
                    completionHandler(data, nil)
                }
            case .failure(let error):
               
                print(error)
                completionHandler(nil, error)
            
            }
        }
    }
    
    func post(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()

        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers:headers).validate().responseJSON { response in
            
            
            switch response.result {
                case .success:
                    
                    if let data = response.result.value {
                        if endPoint.contains("/appusers/login") {
                            self.persistAccessToken(from: data, httpResponse: response.response)
                        }
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    completionHandler(nil, error)
                
            }
            
        }
    }

    func postJSON(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
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
    
    func postWithResponseFormat(endPoint:String, parameters:Any, completionHandler:@escaping (Data?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = defaultHeaders()
        
        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers:headers).responseData { response in
            
            
            switch response.result {
            case .success:
                //print("Validation Successful")
                if let data = response.result.value {
                    
                    completionHandler(data, nil)
                }
            case .failure(let error):
                
                print(error)
                completionHandler(nil, error)
                
            }
            
        }
    }
    
    func put(){
        
    }
    
    func delete(){
        
    }
    
}
