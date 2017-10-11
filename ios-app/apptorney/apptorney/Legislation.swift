//
//  Legislation.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Legislation: Decodable  {
    var legislationNumber: String?
    var legislationName: String?
    var generalTitle: String?
    var chapterNumber: String?
    var legislationNumbers: String?
    var dateOfAssent: String?
    var preamble:String?
    var enactment: String?
    var yearOfAmendment: String?
    var volumeNumber: String?
    var legislationType: String?
    var legislationParts: [LegislationPart]?
    var parentLegislation: String?
    var capturedBy: [String]?
    var capturedById: String?
    var id: String?
    var deleted: Bool?
    
    init(json: JSON) {
        
        self.legislationNumber = json["legislationNumber"].string
        self.legislationName = json["legislationName"].string
        self.generalTitle = json["generalTitle"].string
        self.chapterNumber = json["chapterNumber"].string
        self.legislationNumbers = json["legislationNumbers"].string
        self.dateOfAssent = json["dateOfAssent"].string
        self.preamble = json["preamble"].string
        self.enactment = json["enactment"].string
        self.yearOfAmendment = json["yearOfAmendment"].string
        self.volumeNumber = json["volumeNumber"].string
        self.legislationType = json["legislationType"].string
       
        self.parentLegislation = json["parentLegislation"].string
    }
    
    class func search(term:String?, completionHandler:@escaping ([Legislation], Error?)->Void){
        let api = APIService()
        var legislations = [Legislation]()
       
        api.get(endPoint: "/legislations/flexisearch", parameters: ["term":term!], completionHandler: { (result, error) in
            
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["legislations"]
                    for data in json {
                        let legislation = Legislation(json:data.1)
                        legislations.append(legislation)
                    }
                    
                    
                    
                    //let legislations = try JSONDecoder().decode([Legislation].self, from:json.rawData())
                    //print(result)
                    completionHandler(legislations, nil)
                
                } catch let error as NSError {
                    print("Error:" + error.localizedDescription)
                }
                
            }
        })
    }
}
