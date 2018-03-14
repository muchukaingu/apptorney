//
//  Case.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Case: Decodable  {
    var _id: String?
    var referenceNumber: String?
    var name: String?
    var caseNumber: String?
    var highlight: String?
    var plaintiffs: [String]?
    var defendants: [String]?
    var appearancesForPlaintiffs: [String]?
    var appearancesForDefendants: [String]?
    var coram:String?
    var citation: Citation?
    var summaryOfFacts: String?
    var summaryOfRuling: String?
    var judgement: String?
    var court: [String:String]?
    var courtDivision: [String:String]?
    var location: [String:String]?
    var jurisdiction: [String:String]?
    var areaOfLaw: String?
    var plaintiffSynonym: String?
    var defendantSynonym: String?
    var workReferedTo:[WorkReference]?
    var legislationsReferedTo: [Legislation]?
    var casesReferedTo: [Case]?

    
    
    class func search(term:String?, completionHandler:@escaping ([Case], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/cases/mobilesearch", parameters: ["term":term!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let data = result!
                    let decoder = JSONDecoder()
                    let cases = try decoder.decode([Case].self, from: data)
                    print(cases)
                    completionHandler(cases, nil)
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
            }
        })
    }
    
    class func loadCase(caseId:String?, completionHandler:@escaping (Case, Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/cases/viewCase", parameters: ["id":caseId!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["cases"]
                    let jsonDecoder = JSONDecoder()
                    let caseInstance = try jsonDecoder.decode(Case.self, from: json.rawData())
                    completionHandler(caseInstance, nil)
                } catch let error as NSError {
                    print("Error: \(error)" )
                }
                
            }
        })
    }

}
