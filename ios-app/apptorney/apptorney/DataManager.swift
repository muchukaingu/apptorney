//
//  DataManager.swift
//
//  Created by Muchu Kaingu on 3/1/15.
//  Copyright (c) 2015 Muchu Kaingu All rights reserved.
//

import Foundation



class DataManager {
    
    class func getDataFromURLWithSuccess(_ URL: String, success: @escaping ((_ remoteData: Data?, _ error: NSError?) -> Void)) {
        
        loadDataFromURL(Foundation.URL(string: URL)!, completion:{(data, error) -> Void in
            
            if let urlData = data {
                success(urlData, nil)
            }
            else {
                success(nil, error)
            }
        })
    }
    
    
    class func loadDataFromURL(_ url: URL, completion:@escaping (_ data: Data?, _ error: NSError?) -> Void) {
        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.timeoutIntervalForRequest=20.0
        sessionConfig.timeoutIntervalForResource=20.0
        let session = URLSession(configuration: sessionConfig)
        
        // Use NSURLSession to get data from an NSURL
        let loadDataTask = session.dataTask(with: url, completionHandler: { (data, response, error) -> Void in
            if let responseError = error {
                completion(nil, responseError as NSError?)
            } else if let httpResponse = response as? HTTPURLResponse {
                if httpResponse.statusCode != 200 {
                    let statusError = NSError(domain:"com.circuitbusiness", code:httpResponse.statusCode, userInfo:[NSLocalizedDescriptionKey : "HTTP status code has unexpected value."])
                    completion(nil, statusError)
                } else {
                    completion(data, nil)
                }
            }
        })
        
        loadDataTask.resume()
        
        
        
    }
}
