//
//  UITextViewFixed.swift
//  apptorney
//
//  Created by Muchu Kaingu on 4/11/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

@IBDesignable class UITextViewFixed: UITextView {
    override func layoutSubviews() {
        super.layoutSubviews()
        setup()
    }
    func setup() {
        textContainerInset = UIEdgeInsets.init(top: 5, left: 0, bottom: 8, right: 0)
        textContainer.lineFragmentPadding = 0
    }
}
