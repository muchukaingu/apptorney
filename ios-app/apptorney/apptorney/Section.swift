//
//  Section.swift
//  TableViewDropDown
//
//  Created by BriefOS on 5/3/17.
//  Copyright © 2017 BriefOS. All rights reserved.
//

import Foundation

struct Section {
    var name: String!
    var expanded: Bool!
    var height:CGFloat?
    
    init(name: String, expanded: Bool, height: CGFloat?) {
        self.name = name
        self.expanded = expanded
        self.height = height ?? 55.0
    }
}
