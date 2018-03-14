//
//  LegislationPart.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/17/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class LegislationPart: Decodable {
    var number:String?
    var title:String?
    var content:String?
    var subParts:[LegislationPart]?
    var table: String?
    var file: String?
    var flatContentNew:String?
}
