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
    var isCollapsed: Bool!
    var height:CGFloat?
    var isCollapsible:Bool?
    var content: String?
    
    
    init(name: String, isCollapsed: Bool, height: CGFloat?, isCollapsible:Bool, content:String?) {
        self.name = name
        self.isCollapsed = isCollapsed
        self.height = height ?? 55.0
        self.isCollapsible = isCollapsible
        self.content = content
        
    }
}
