//
//  AppModel.swift
//  TopApps
//
//  Created by Dani Arnaout on 9/1/14.
//  Edited by Eric Cerney on 9/27/14.
//  Copyright (c) 2014 Ray Wenderlich All rights reserved.
//

import Foundation

class Category: NSObject {
    @objc let categoryID: Int
    @objc let name: String
    @objc let with_stk: Float
    @objc let neg_stk: Float
    @objc let total_stk: Float
    @objc let dormant: Float
    
    
    
    override var description: String {
        return name
    }
    
    init(categoryID: Int?,name: String?, with_stk: Float?, neg_stk: Float?, total_stk: Float?, dormant: Float?) {
        self.categoryID = categoryID ?? 0
        self.name = name ?? ""
        self.with_stk = with_stk ?? 0.0
        self.neg_stk = neg_stk ?? 0.0
        self.total_stk = total_stk ?? 0.0
        self.dormant = dormant ?? 0.0
        
    }
}
