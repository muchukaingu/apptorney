//
//  Subscription.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/22/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation

class Subscription {
    class func checkSubscription(completionHandler:@escaping (Bool, Error?)->Void){
        let api = APIService()
        let userDefaults = UserDefaults.standard
        if let username = userDefaults.string(forKey: "username"){
            print(username)
            api.postWithResponseFormat(endPoint: "/subscriptions/checkSubscription", parameters: ["userName": username], completionHandler: { (result, error) in
                
                if error != nil {
                    print(error!)
                }
                else {
                    do {
                        let data = result!
                        let decoder = JSONDecoder()
                        let response = try decoder.decode(APIResponse.self, from: data)
                        print(response.statusCode)
                        switch response.statusCode {
                            case 200:
                                completionHandler(true, nil)
                            case 404:
                                completionHandler(false, nil)
                            default:
                                completionHandler(false, nil)
                        }
                        
                       
                    } catch let error as NSError {
                        print("Error: " + error.localizedDescription)
                    }
                }
                
            })
        }
    }
    
    class func checkForUpdate(completionHandler:@escaping (Bool, Error?)->Void){
        let api = APIService()
        let currentAppVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String // gets current app version on user's device
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String // gets current app version on user's device
        let fullVersion = currentAppVersion + "." + build
        
        api.postWithResponseFormat(endPoint: "/updates/checkForUpdate", parameters: ["version": fullVersion], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let data = result!
                    let decoder = JSONDecoder()
                    let response = try decoder.decode(APIResponse.self, from: data)
                    print("Response \(response)")
                    switch response.data {
                    case "update":
                        completionHandler(true, nil)
                    case "noUpdate":
                        completionHandler(false, nil)
                    default:
                        completionHandler(false, nil)
                    }
                    
                    
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
            
        })
    }
}
