//
//  LegislationStruct.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/23/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

class Legislation: Codable {
    let legislationNumber: String?
    let legislationName: String?
    let generalTitle: String?
    let chapterNumber: String?
    let legislationNumbers: String?
    let dateOfAssent: String?
    let preamble:String?
    let enactment: String?
    let yearOfAmendment: Int?
    let volumeNumber: String?
    let legislationType: String?
    let legislationParts: [LegislationPart]?
    let parentLegislation: String?
    //let capturedBy: [String]?
    //let capturedById: String?
    let _id: String?
    let deleted: Bool?
    let score: Float?
    
    struct LegislationPart: Codable {
        let title:String?
        let content:String?
        let subParts:[LegislationPart]?
        let table: Table?
        //let file: String?
        let showTable: Bool?
        let level: Int?
        let number: String?
        let id: Int?
        
        struct Table: Codable {
            let title: String?
            let content:[TableContent]
            struct TableContent: Codable {
                let key:String?
                let value:String?
            }
        }
    }
    
    class func search(term:String?, completionHandler:@escaping ([Legislation], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/legislations/mobilesearch", parameters: ["term":term!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["legislations"]
                    let jsonDecoder = JSONDecoder()
                    let legislations = try jsonDecoder.decode(Array<Legislation>.self, from: json.rawData())
                    print(legislations)
                    completionHandler(legislations, nil)
                } catch let error as NSError {
                    print("Error: \(error)" )
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
