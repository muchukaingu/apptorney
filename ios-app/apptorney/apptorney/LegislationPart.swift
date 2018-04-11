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
    var table: Table?
    var file: File?
    var flatContentNew:String?
}


struct FlatLegislationPart {
    var number:String?
    var title:String?
    var content:String?
    var table: Table?
    var file: File?
    
    init(number:String?, title:String?, content:String?, table:Table?, file:File?) {
        self.number = number ?? ""
        self.title = title ?? ""
        self.content = content ?? ""
        self.table = table ?? Table()
        self.file = file ?? File()
    }
}
