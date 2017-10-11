//
//  Appuser.class.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/30/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation


class Appuser {
    
    var email:String?
    var password:String?
    var userId:String?
    
    
    func login(email:String?, password:String?, completionHandler:@escaping (Any, Error?)->Void){
        let api = APIService()
        api.delegate = self
        api.post(endPoint: "/appusers/login", parameters: ["email":email!, "password":password!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                struct loginResult {
                    var created: String
                    var id: String
                    var ttl: String
                    var userId: String
                }
                
               let login = JSON(result)
                if login["userId"] == nil{
                    print("login failed")
                    completionHandler(false, NSError(domain:"Login Failed", code:100, userInfo:nil))
                }
                else{
                    completionHandler(true, nil)
                }
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
