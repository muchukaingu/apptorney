//
//  LegislationStruct.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/23/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

class Legislation: Codable {
    var legislationNumber: String?
    var legislationName: String?
    var generalTitle: String?
    var chapterNumber: String?
    var legislationNumbers: String?
    var dateOfAssent: String?
    var preamble:String?
    var enactment: String?
    var yearOfAmendment: Int?
    var volumeNumber: String?
    var legislationType: String?
    var searchHighlight: String?
    var _id: String?
   
    
    init(json: JSON?) {
        self.legislationNumber = json!["legislationNumber"].string
        self.legislationName = json!["legislationName"].string
        self.generalTitle = json!["generalTitle"].string
        self.chapterNumber = json!["chapterNumber"].string
        self.legislationNumbers = json!["legislationNumbers"].string
        self.dateOfAssent = json!["dateOfAssent"].string
        self.yearOfAmendment = json!["yearOfAmendment"].int
        self.volumeNumber = json!["volumeNumber"].string
        self.preamble = json!["preamble"].string
        self.enactment = json!["enactment"].string
        self.volumeNumber = json!["volumeNumber"].string
        self.searchHighlight = json!["highlight"].string
        self._id = json!["_id"].string
        
    }
    
    
    class func search(term:String?, completionHandler:@escaping ([Legislation], Error?)->Void){
        let api = APIService()
        var legislations = [Legislation]()
        api.get(endPoint: "/legislations/mobilesearch", parameters: ["term":term!], completionHandler: { (result, error) in
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
    
    class func loadLegislation(legislationId:String?, completionHandler:@escaping (Legislation, Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/legislations/viewLegislation", parameters: ["id":legislationId!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["legislation"]
                    let jsonDecoder = JSONDecoder()
                    let legislations = try jsonDecoder.decode(Legislation.self, from: json.rawData())
                    completionHandler(legislations, nil)
                } catch let error as NSError {
                    print("Error: \(error)" )
                }
                
            }
        })
    }
    
}
