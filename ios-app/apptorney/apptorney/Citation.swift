//
//  Citation.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import Foundation

class Citation: Decodable {
    var description: String?
    var number: String?
    var year: Int?
    var code: String?
    var pageNumber: Int?
}
