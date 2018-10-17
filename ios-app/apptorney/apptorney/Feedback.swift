//
//  Feedback.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/3/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation

class Feedback {
    class func sendFeedback(feedback:String?, scope: String?, resourceType: String?, completionHandler:@escaping (Any, Error?)->Void){
        print("feedback in")
        let api = APIService()
        
        let userDefaults = UserDefaults.standard
        if let username = userDefaults.string(forKey: "username"){
        
                let currentAppVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String // gets current app version on user's device
                let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String // gets current app version on user's device
                let fullVersion = currentAppVersion + "." + build
                let platform = "iOS"
            let params = ["appVersion": fullVersion, "platform": platform, "username":username, "feedback":feedback!, "scope": scope!, resourceType: resourceType! ]
                api.post(endPoint: "/feedback", parameters: params, completionHandler: { (result, error) in
                    
                    if error != nil {
                        print(error)
                        completionHandler(false, error)
                    }
                    else {
                        completionHandler(true, nil)
                    }
                })
            
        }
        
        
        
        
        
    }
}
