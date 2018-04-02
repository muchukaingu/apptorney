//
//  HomeItem.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/12/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class HomeItem: Decodable {
    var title:String?
    var summary:String?
    var type: String?
    var sourceId: String?
    
    init (title: String, summary: String, type: String, sourceId: String) {
        self.title = title
        self.summary = summary
        self.type = type
        self.sourceId = sourceId
    }
    
    class func getBookmarks(completionHandler:@escaping ([HomeItem], Error?)->Void){
        print("Bookmarking, mafa")
        let api = APIService()
        let userDefaults = UserDefaults.standard
        if let username = userDefaults.string(forKey: "username"){
            api.get(endPoint: "/Customers/bookmarks", parameters: ["username":username], completionHandler: { (result, error) in
                if error != nil {
                    print(error!)
                }
                else {
                    do {
                        let json = result!
                        let decoder = JSONDecoder()
                        let items = try decoder.decode([HomeItem].self, from: json)
                        print(items)
                        completionHandler(items, nil)
                    } catch let error as NSError {
                        print("Error: " + error.localizedDescription)
                    }
                }
            })
        }
        

    }
    
    
    class func addBookmarks(bookmark: HomeItem, completionHandler:@escaping (Any, Error?)->Void){
        print(bookmark)
        let api = APIService()
        let userDefaults = UserDefaults.standard
        if let username = userDefaults.string(forKey: "username"){
            let user = Appuser()
            user.phoneNumber = username
            api.post(endPoint: "/Customers/bookmark", parameters: ["username":user.phoneNumber! as String, "sourceId": bookmark.sourceId! as String, "type": bookmark.type! as String], completionHandler: { (result, error) in
                
                if error != nil {
                    
                     completionHandler(false, error)
                }
                else {
                    print(bookmark)
                    completionHandler(true, nil)
                }
            })
            
        }
        
        
    }
    
    class func getNews(completionHandler:@escaping ([HomeItem]?, Error?)->Void){
        print("Bookmarking, mafa")
        let api = APIService()
        
        api.get(endPoint: "/news", parameters: nil, completionHandler: { (result, error) in
            if error != nil {
                 completionHandler(nil, error)
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]
                    let decoder = JSONDecoder()
                    let news = try decoder.decode([HomeItem].self, from: json.rawData())
                    print(news)
                    completionHandler(news, nil)
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
        })
        
        
    }
    
    
    class func getTrends(completionHandler:@escaping ([HomeItem]?, Error?)->Void){
        print("Bookmarking, mafa")
        let api = APIService()
       
        api.get(endPoint: "/trendings", parameters: nil, completionHandler: { (result, error) in
            if error != nil {
                completionHandler(nil, error)
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]
                    let decoder = JSONDecoder()
                    let trends = try decoder.decode([HomeItem].self, from: json.rawData())
                    print(trends)
                    completionHandler(trends, nil)
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
        })
        
        
    }
}
