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
    var id: String?
    var referenceNumber: String?
    var name: String?
    var caseNumber: String?
    var highlight: String?
    var plaintiffs: [Party]?
    var defendants: [Party]?
    var appearancesForPlaintiffs: [Appearance]?
    var appearancesForDefendants: [Appearance]?
    var coram:[Coram]?
    var citation: Citation?
    var summaryOfFacts: String?
    var summaryOfRuling: String?
    var judgement: String?
    var court: Court?
    var courtDivision: Division?
    var location: Location?
    var jurisdiction: Jurisdiction?
    var areaOfLaw: AreaOfLaw?
    //var plaintiffSynonym: Synonym?
    //var defendantSynonym: Synonym?
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
    
    
    class func getByArea(area: String?, completionHandler:@escaping ([Case], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/cases/getByArea", parameters: ["areaId": area! as String], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["cases"]
                    //print(json)
                    let decoder = JSONDecoder()
                    let cases = try decoder.decode([Case].self, from: json.rawData())
                    print(cases)
                    completionHandler(cases, nil)
                    
                } catch let error as NSError {
                    print("Error: " + error.localizedDescription)
                }
                
            }
        })
    }
    
    
    class func getByYear(year: Int?, completionHandler:@escaping ([Case], Error?)->Void){
        let api = APIService()
        api.get(endPoint: "/cases/getByYear", parameters: ["year": year! as Int], completionHandler: { (result, error) in
            if error != nil {
                print(error!)
            }
            else {
                do {
                    let json = JSON(result!)["data"]["cases"]
                    //print(json)
                    let decoder = JSONDecoder()
                    let cases = try decoder.decode([Case].self, from: json.rawData())
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
