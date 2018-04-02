//
//  LegislationType.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/27/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation


class LegislationType: Decodable {
    var name: String?
    var _id: String?
    var id: String?
    var description: String?
    
    init(name: String?, _id: String?, description: String?, id: String?) {
        self.name = name
        self._id = _id
        self.description = description
        self.id = id
    }
    
    class func search(completionHandler:@escaping ([LegislationType], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/legislationTypes", parameters: nil, completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]
                    let decoder = JSONDecoder()
                    let types = try decoder.decode([LegislationType].self, from: json.rawData())
                    print(types)
                    completionHandler(types, nil)
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
        })
    }
    
}
