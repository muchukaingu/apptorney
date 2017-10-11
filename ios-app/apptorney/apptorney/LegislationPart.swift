//
//  LegislationPart.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/17/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class LegislationPart: Decodable {
    var title:String?
    var content:String?
    var subParts:[LegislationPart]
    var table: String?
    var file: String?
    
    init (title: String?, content: String?, subParts:[LegislationPart]?, table: String?, file:String?) {
        self.title = title ?? ""
        self.content = content ?? ""
        self.subParts = subParts ?? [LegislationPart]()
        self.table = table ?? ""
        self.file = file ?? ""
    }
}
