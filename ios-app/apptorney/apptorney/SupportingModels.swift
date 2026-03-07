//
//  SupportingModels.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/17/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation

class Party: Decodable {
    var name: String?
    var _id: String?
}

class Appearance: Decodable {
    var advocate: String?
    var lawFirm: String?
    var _id: String?
}

class Coram: Decodable {
    var name: String?
}

class Division: Decodable {
    var name: String?
    var _id: String?
}

class Jurisdiction: Decodable {
    var name: String?
    var _id: String?
}

class Synonym: Decodable {
    var synonym: String?
    var _id: String?
}

class Location: Decodable {
    var name: String?
    var _id: String?
    var id: String?
}

class AreaOfLaw: Decodable {
    var name: String?
    var _id: String?
    var id: String?
    var description: String?
    
    init(name: String?, _id: String?, description: String?, id: String?) {
        self.name = name
        self._id = _id
        self.id = id
        self.description = description
    }
    
    class func search(completionHandler:@escaping ([AreaOfLaw], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/areaOfLaws/parents", parameters: nil, completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]
                    let decoder = JSONDecoder()
                    let areas = try decoder.decode([AreaOfLaw].self, from: json.rawData())
                    print(areas)
                    completionHandler(areas, nil)
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
        })
    }
}


class File: Decodable {
    var name: String?
    var type: String?
    var url: String?
    var id: String?
}


class Table: Decodable {
    var title: String?
    var content: [String]?
    var id: String?
}



