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
    
    
    func login(username:String?, password:String?, completionHandler:@escaping (Any, Error?)->Void){
        print("logging in")
        let api = APIService()
        api.delegate = self
        api.post(endPoint: "/appusers/login", parameters: ["username":username!, "password":password!], completionHandler: { (result, error) in
            
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
                
               completionHandler(true, nil)
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

    
    
}

extension Appuser: APIServiceDelegate {
    func APIServiceDidFinish(ApiService: APIService, result: Any?) {
         print("XXX")
    }
    
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?) {
        //
    }
}
