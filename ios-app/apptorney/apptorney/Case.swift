//
//  Case.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Case  {
    var referenceNumber: String?
    var name: String?
    var plaintiffs: [String]?
    var defendants: [String]?
    var appearancesForPlaintiffs: [String]?
    var appearancesForDefendants: [String]?
    var coram:[String]?
    var citation: Citation?
    var summaryOfFacts: String?
    var summaryOfRuling: String?
    var judgement: String?
    var court: String?
    var courtDivision: String?
    var location: String?
    var jurisdiction: String?
    var area: String?
    var plaintiffSynonym: String?
    var defendantSynonym: String?
    var workReferedTo:[WorkReference]?
    var legislationsReferedTo: [Legislation]?
    var casesReferedTo: [Case]?
    
    init(json: JSON) {
        self.referenceNumber = json["referenceNumber"].string
        self.name = json["name"].string
        self.summaryOfFacts = json["summaryOfFacts"].string
        self.summaryOfRuling = json["summaryOfRuling"].string
        self.judgement = json["judgement"].string
        self.court = json["court"].string
        self.courtDivision = json["courtDivision"].string
        self.location = json["location"].string
        self.jurisdiction = json["jurisdiction"].string
        self.area = json["area"].string
        self.plaintiffSynonym = json["plaintiffSynonym"].string
        self.defendantSynonym = json["defendantSynonym"].string
     
    }
    
    class func search(term:String?, completionHandler:@escaping ([Case], Error?)->Void){
        let api = APIService()
        var cases = [Case]()
        
        api.get(endPoint: "/cases/flexisearch", parameters: ["term":term!], completionHandler: { (result, error) in
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
}
