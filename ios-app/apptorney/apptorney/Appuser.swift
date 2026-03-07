//
//  Appuser.class.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/30/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation


class Appuser {
    
    var username:String?
    var password:String?
    var userId:String?
    var firstName:String?
    var lastName:String?
    var phoneNumber: String?
    var emailAddress: String?

    private func stringValue(_ value: Any?) -> String {
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

                let token = stringValue(candidate)
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
        return ""
    }

    private func userIdFromNestedPayload(_ value: Any?) -> String {
        if let dict = value as? [String: Any] {
            let directCandidates: [Any?] = [
                dict["userId"],
                dict["user_id"]
            ]
            for candidate in directCandidates {
                let userId = stringValue(candidate)
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
    
    
    func login(username:String?, password:String?, completionHandler:@escaping (Any, Error?)->Void){
        print("logging in")
        let trimmedUsername = username?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        let trimmedPassword = password?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""

        guard !trimmedUsername.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400, userInfo: [NSLocalizedDescriptionKey: "username or email is required"]))
            return
        }

        guard !trimmedPassword.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400, userInfo: [NSLocalizedDescriptionKey: "password is required"]))
            return
        }

        let api = APIService()
        api.delegate = self
        api.post(endPoint: "/appusers/login", parameters: ["username": trimmedUsername, "password": trimmedPassword], completionHandler: { (result, error) in
            
            if error != nil {
                completionHandler(false, error)
            }
            else {
                let token = self.tokenFromNestedPayload(result)
                let userId = self.userIdFromNestedPayload(result)
                if self.isPlausibleToken(token) {
                    let defaults = UserDefaults.standard
                    defaults.set(token, forKey: APIService.authTokenStorageKey)
                    defaults.set(token, forKey: "access_token")
                    defaults.set(token, forKey: "accessToken")
                    defaults.set(token, forKey: "token")
                    defaults.set(token, forKey: "id")
                    if !userId.isEmpty {
                        defaults.set(userId, forKey: APIService.authUserIdStorageKey)
                        defaults.set(userId, forKey: "userId")
                    }
                    defaults.synchronize()
                    completionHandler(true, nil)
                    return
                }

                completionHandler(false, NSError(
                    domain: "AuthError",
                    code: 401,
                    userInfo: [NSLocalizedDescriptionKey: "Login succeeded but no valid session token was returned."]
                ))
            }
        })
    }
    
    
    func register(user:Appuser, completionHandler:@escaping (Any, Error?)->Void){
        print("Registering")
        let api = APIService()
        api.delegate = self
        api.post(endPoint: "/Customers", parameters: ["firstName":user.firstName! as String, "lastName":user.lastName! as String, "phoneNumber":user.phoneNumber! as String, "emailAddress":user.emailAddress! as String, "password":user.password! as String ], completionHandler: { (result, error) in
         
            if error != nil {
                completionHandler(false, error)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
                let res = JSON(result)
                /*if login["userId"] == nil{
                    print("login failed")
                    completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                }
                else{
                    completionHandler(true, nil)
                }*/
                print(res)
                completionHandler(true, nil)
            }
        })
    }
    
    
    func verify(username:String?, token:String?, completionHandler:@escaping (Any, Error?)->Void){
        let api = APIService()
        api.delegate = self
        api.getAsJSON(endPoint: "/appusers/confirmPhone", parameters: ["username": username!, "token": token!], completionHandler: { (result, error) in
            
            if error != nil {
                completionHandler(false, error)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
                let res = JSON(result)
                /*if login["userId"] == nil{
                 print("login failed")
                 completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                 }
                 else{
                 completionHandler(true, nil)
                 }*/
                print(res)
                completionHandler(true, nil)
            }
        })
    }
    
    
    func resendVerification(username:String?, completionHandler:@escaping (Any, Error?)->Void){
        let api = APIService()
        api.delegate = self
        api.getAsJSON(endPoint: "/appusers/resendVerification", parameters: ["username": username!], completionHandler: { (result, error) in
            
            if error != nil {
                completionHandler(false, error)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
                let res = JSON(result)
                /*if login["userId"] == nil{
                 print("login failed")
                 completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                 }
                 else{
                 completionHandler(true, nil)
                 }*/
                print(res)
                completionHandler(true, nil)
            }
        })
    }
    
    
    func requestPasswordReset(username:String?, completionHandler:@escaping (Any, Error?)->Void){
        let api = APIService()
        api.delegate = self
        api.getAsJSON(endPoint: "/appusers/requestPasswordReset", parameters: ["username": username!], completionHandler: { (result, error) in
            
            if error != nil {
                completionHandler(false, error)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
                let res = JSON(result)
                /*if login["userId"] == nil{
                 print("login failed")
                 completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                 }
                 else{
                 completionHandler(true, nil)
                 }*/
                print(res)
                completionHandler(true, nil)
            }
        })
    }
    
    
    func resetPassword(username:String?, token: String?, password: String?, completionHandler:@escaping (Any, Error?)->Void){
        let api = APIService()
        api.delegate = self
        api.getAsJSON(endPoint: "/appusers/resetPasswordWithOTP", parameters: ["username": username!, "password": password!, "token": token!], completionHandler: { (result, error) in
            
            if error != nil {
                completionHandler(false, error)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
                let res = JSON(result)
                /*if login["userId"] == nil{
                 print("login failed")
                 completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                 }
                 else{
                 completionHandler(true, nil)
                 }*/
                print(res)
                completionHandler(true, nil)
            }
        })
    }


    
    
}

extension Appuser: APIServiceDelegate {
    func APIServiceDidFinish(ApiService: APIService, result: Any?) {
         print("XXX")
    }
    
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?) {
        //
    }
}
