//
//  CAMediaTimingFunction+Windless.swift
//  Windless-iOS
//
//  Created by gwangbeom on 2017. 11. 8..
//  Copyright © 2017년 Windless. All rights reserved.
//

import UIKit

public extension CAMediaTimingFunction {
    
    static let linear = CAMediaTimingFunction(name: .linear)
    
    static let easeIn = CAMediaTimingFunction(name: .easeIn)
    
    static let easeOut = CAMediaTimingFunction(name: .easeOut)
    
    static let easeInOut = CAMediaTimingFunction(name: .easeInEaseOut)
}
