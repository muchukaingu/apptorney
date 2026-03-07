//
//  AppModel.swift
//  TopApps
//
//  Created by Dani Arnaout on 9/1/14.
//  Edited by Eric Cerney on 9/27/14.
//  Copyright (c) 2014 Ray Wenderlich All rights reserved.
//

import Foundation

class Department: NSObject {
    @objc let departmentID: Int
    @objc let name: String
    @objc let with_stk: Float
    @objc let neg_stk: Float
    @objc let total_stk: Float
    @objc let deviation: String
    @objc let rangesold: Float
    @objc let magicmix: String
    @objc let openingstk: Float
    @objc let dormant: Float
    @objc let model:Float
    
    
    
    override var description: String {
        return name
    }
    
    init(departmentID: Int?,name: String?, with_stk: Float?, neg_stk: Float?, total_stk: Float?, deviation: String?, rangesold: Float?, magicmix: String?, openingstk: Float?, dormant: Float?, model:Float?) {
        self.departmentID = departmentID ?? 0
        self.name = name ?? ""
        self.with_stk = with_stk ?? 0.0
        self.neg_stk = neg_stk ?? 0.0
        self.total_stk = total_stk ?? 0.0
        self.deviation = deviation ?? ""
        self.rangesold = rangesold ?? 0.0
        self.magicmix = magicmix ?? ""
        self.openingstk = openingstk ?? 0.0
        self.dormant = dormant ?? 0.0
        self.model = model ?? 0.0
        
    }
}
