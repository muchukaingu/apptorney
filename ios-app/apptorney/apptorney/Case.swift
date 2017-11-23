//
//  Case.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Case  {
    var caseId: String?
    var referenceNumber: String?
    var name: String?
    var caseNumber: String?
    var searchHighlight: String?
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
    var area: String?
    var plaintiffSynonym: String?
    var defendantSynonym: String?
    var workReferedTo:[WorkReference]?
    var legislationsReferedTo: [Legislation]?
    var casesReferedTo: [Case]?
    
    init(json: JSON?) {
        self.caseId = json!["_id"].string
        self.referenceNumber = json!["referenceNumber"].string
        self.caseNumber = json!["caseNumber"].string
        self.name = json!["name"].string
        self.searchHighlight = json!["highlight"].string
        self.summaryOfFacts = json!["summaryOfFacts"].string
        self.summaryOfRuling = json!["summaryOfRuling"].string
        self.judgement = json!["judgement"].string
        self.court = json!["court"].dictionaryObject as? [String : String]
        self.courtDivision = json!["courtDivision"].dictionaryObject as? [String : String]
        self.location = json!["location"].dictionaryObject as? [String : String]
        self.jurisdiction = json!["jurisdiction"].dictionaryObject as? [String : String]
        self.area = json!["areaOfLaw"].string
        self.coram = json!["judges"].string
        self.plaintiffSynonym = json!["plaintiffSynonym"].string
        self.defendantSynonym = json!["defendantSynonym"].string
     
    }
    
    class func search(term:String?, completionHandler:@escaping ([Case], Error?)->Void){
        let api = APIService()
        var cases = [Case]()
        
        api.get(endPoint: "/cases/mobilesearch", parameters: ["term":term!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["cases"]
                    
                    for data in json {
                        let caseInstance = Case(json:data.1)
                        cases.append(caseInstance)
                    }
                    
                    
                    
                    //let legislations = try JSONDecoder().decode([Legislation].self, from:json.rawData())
                    //print(result)
                    completionHandler(cases, nil)
                    
                } catch let error as NSError {
                    print("Error:" + error.localizedDescription)
                }
                
            }
        })
    }
    
    class func loadCase(caseId:String?, completionHandler:@escaping (Case, Error?)->Void){
        let api = APIService()
        var caseInstance:Case!
        
        api.get(endPoint: "/cases/viewCase", parameters: ["id":caseId!], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["cases"]
                    //print("JSON Response \(json)")
                    
                   /* for data in json {
                        caseInstance = Case(json:data.1)
                        print(caseInstance.name)
                        //cases.append(caseInstance)
                    }*/
                    
                    caseInstance = Case(json: json)
                    
                    
                    
                    //let legislations = try JSONDecoder().decode([Legislation].self, from:json.rawData())
                    //print(result)
                    completionHandler(caseInstance, nil)
                    
                } catch let error as NSError {
                    print("Error:" + error.localizedDescription)
                }
                
            }
        })
    }
}
