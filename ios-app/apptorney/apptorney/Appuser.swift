//
//  Appuser.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/30/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Appuser {

    var email: String?
    var userId: String?
    var firstName: String?
    var lastName: String?
    var phoneNumber: String?
    var organization: String?
    var role: String?

    // MARK: - Auth: Request OTP for login

    func login(email: String, completionHandler: @escaping (Bool, Error?) -> Void) {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        guard !trimmed.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400,
                userInfo: [NSLocalizedDescriptionKey: "Email is required."]))
            return
        }

        let api = APIService()
        api.postJSON(endPoint: "/auth/login", parameters: ["email": trimmed]) { result, error in
            if let error = error {
                completionHandler(false, error)
            } else {
                completionHandler(true, nil)
            }
        }
    }

    // MARK: - Auth: Register new account

    func register(completionHandler: @escaping (Bool, Error?) -> Void) {
        let trimmedEmail = (email ?? "").trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let trimmedFirst = (firstName ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedLast = (lastName ?? "").trimmingCharacters(in: .whitespacesAndNewlines)

        guard !trimmedEmail.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400,
                userInfo: [NSLocalizedDescriptionKey: "Email is required."]))
            return
        }
        guard !trimmedFirst.isEmpty, !trimmedLast.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400,
                userInfo: [NSLocalizedDescriptionKey: "First name and last name are required."]))
            return
        }

        var params: [String: String] = [
            "email": trimmedEmail,
            "firstName": trimmedFirst,
            "lastName": trimmedLast
        ]

        let trimmedPhone = (phoneNumber ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedPhone.isEmpty {
            params["phoneNumber"] = trimmedPhone
        }

        let trimmedOrg = (organization ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedOrg.isEmpty {
            params["organization"] = trimmedOrg
        }

        let api = APIService()
        api.postJSON(endPoint: "/auth/register", parameters: params) { result, error in
            if let error = error {
                completionHandler(false, error)
            } else {
                completionHandler(true, nil)
            }
        }
    }

    // MARK: - Auth: Verify OTP and receive JWT tokens

    func verifyOtp(email: String, otp: String, completionHandler: @escaping (Bool, Error?) -> Void) {
        let trimmedEmail = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let trimmedOtp = otp.trimmingCharacters(in: .whitespacesAndNewlines)

        guard !trimmedEmail.isEmpty, !trimmedOtp.isEmpty else {
            completionHandler(false, NSError(domain: "ValidationError", code: 400,
                userInfo: [NSLocalizedDescriptionKey: "Email and OTP are required."]))
            return
        }

        let api = APIService()
        api.postJSON(endPoint: "/auth/verify-otp", parameters: ["email": trimmedEmail, "otp": trimmedOtp]) { result, error in
            if let error = error {
                completionHandler(false, error)
                return
            }

            guard let dict = result as? [String: Any],
                  let accessToken = dict["accessToken"] as? String,
                  let refreshToken = dict["refreshToken"] as? String else {
                completionHandler(false, NSError(domain: "AuthError", code: 401,
                    userInfo: [NSLocalizedDescriptionKey: "Invalid response from server."]))
                return
            }

            let user = dict["user"] as? [String: Any] ?? [:]
            let userId = (user["id"] as? String) ?? (user["_id"] as? String) ?? ""
            let role = user["role"] as? String ?? "user"

            APIService.persistSession(
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: userId,
                email: trimmedEmail,
                userName: "\(user["firstName"] as? String ?? "") \(user["lastName"] as? String ?? "")".trimmingCharacters(in: .whitespaces),
                role: role
            )

            completionHandler(true, nil)
        }
    }

    // MARK: - Auth: Resend OTP (just calls login again)

    func resendOtp(email: String, completionHandler: @escaping (Bool, Error?) -> Void) {
        login(email: email, completionHandler: completionHandler)
    }
}
