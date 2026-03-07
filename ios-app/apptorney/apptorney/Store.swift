//
//  Store.swift
//  MR
//
//  Created by Muchu Kaingu on 4/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import Foundation

class Store: NSObject {
    @objc let StoreName: String
    
    
    override var description: String {
        return "Name: \(StoreName)\n"
    }
    
    @objc init(StoreName: String?) {
        self.StoreName = StoreName ?? ""
    }
    
    
}
