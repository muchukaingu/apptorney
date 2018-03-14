//
//  LegislationStruct.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/23/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

class Legislation: Decodable {
    var legislationNumber: String?
    var legislationName: String?
    var legislationNumbers: String?
    var preamble:String?
    var highlight: String?
    var _id: String?
    var legislationParts: [LegislationPart]?
    var legislationType: String?
    var volumeNumber: String?
    var chapterNumber: String?
    var dateOfAssent: String?
    var enactment: String?
    var yearOfAmendment: Int?
    
    
    class func search(term:String?, completionHandler:@escaping ([Legislation], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/legislations/mobilesearch", parameters: ["term":term!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let data = result!
                    let decoder = JSONDecoder()
                    let legislations = try decoder.decode([Legislation].self, from: data)
                    print(legislations)
                    completionHandler(legislations, nil)
                    
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
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
