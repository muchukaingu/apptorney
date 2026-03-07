//
//  APIResponse.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/22/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation

struct Err: Decodable {
    var message: String?
    var stack: String?
}

struct APIResponse: Decodable {
    var success: Bool?
    var statusCode: Int?
    var err: Err? //technical error message
    var message: String? //user friendly error message
    var data: String?
}
