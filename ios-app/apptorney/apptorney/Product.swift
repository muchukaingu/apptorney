//
//  AppModel.swift
//  TopApps
//
//  Created by Dani Arnaout on 9/1/14.
//  Edited by Eric Cerney on 9/27/14.
//  Copyright (c) 2014 Ray Wenderlich All rights reserved.
//

import Foundation

class Product: NSObject {
    @objc let barcode: String
    @objc let productDescription: String
    @objc let quantity: Float
    @objc let cost: Float
    @objc let price: Float
    @objc let GP: Float
    @objc let ROS: Float
    @objc let department: String
    @objc let category: String
    @objc let supplier: String
    @objc let lastReceived: String
    @objc let lastReceivedQty: Float
    @objc let lastOrdered: String
    @objc let lastOrderedQty: Float
    @objc let lastSold: String
    @objc let promoStatus: Int
    @objc let inStockPercentage: Float
    @objc let daysOnHand: Float
    @objc let lastOrderNumber: String
    @objc let inactive: Int
    @objc let donotorder: Int
    @objc let StatMin: Int
    @objc let SafetyDays: Int
    @objc let MPQ: Int
    @objc let SKUStatus: String
    @objc let OpenOrders: Float
    @objc let categoryID: Int
    @objc let departmentID: Int
    @objc let supplierID: Int
    @objc let dailyros: Float
    @objc let weeklyros: Float
    
  
  override var description: String {
    return "Name: \(barcode), URL: \(productDescription)\n"
  }
  
    init(barcode: String?, productDescription: String?, quantity: Float?, cost: Float?, price: Float?, GP: Float?, ROS: Float?, department: String?, category: String?, supplier: String?, lastReceived: String?, lastReceivedQty: Float?, lastOrdered: String?, lastOrderedQty: Float?, lastSold: String?, promoStatus: Int?, inStockPercentage: Float?, lastOrderNumber: String?, daysOnHand: Float?, inactive: Int?, donotorder: Int?, SafetyDays: Int?, StatMin: Int?, MPQ: Int?, SKUStatus: String?, OpenOrders: Float?, categoryID: Int?, departmentID: Int?, supplierID: Int?, dailyros: Float?, weeklyros: Float?) {
        self.barcode = barcode ?? ""
        self.productDescription = productDescription ?? ""
        self.quantity = quantity ?? 0.0
        self.cost = cost ?? 0.0
        self.price = price ?? 0.0
        self.GP = GP ?? 0.0
        self.ROS = ROS ?? 0.0
        self.department = department ?? ""
        self.category = category ?? ""
        self.supplier = supplier ?? ""
        self.lastReceived = lastReceived ?? ""
        self.lastReceivedQty = lastReceivedQty ?? 0.0
        self.lastOrdered = lastOrdered ?? ""
        self.lastOrderedQty = lastOrderedQty ?? 0.0
        self.lastSold = lastSold ?? ""
        self.promoStatus = promoStatus ?? 0
        self.inStockPercentage = inStockPercentage ?? 0.0
        self.lastOrderNumber = lastOrderNumber ?? ""
        self.daysOnHand = daysOnHand ?? 0.0
        self.inactive = inactive ??  0
        self.donotorder = donotorder ?? 0
        self.StatMin = StatMin ??  0
        self.SafetyDays = SafetyDays ?? 0
        self.MPQ = MPQ ?? 0
        self.SKUStatus = SKUStatus ?? ""
        self.OpenOrders = OpenOrders ?? 0.0
        self.categoryID = categoryID ?? 0
        self.departmentID = departmentID ?? 0
        self.supplierID = supplierID ?? 0
        self.dailyros = dailyros ?? 0.0
        self.weeklyros = weeklyros ?? 0.0
        
        
        
        
    
        
        
  }
}
