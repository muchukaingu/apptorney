//
//  CustomTextField.swift
//  MR
//
//  Created by Muchu Kaingu on 3/30/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class CustomTextField : UITextField
{
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        let clearButton = UIButton(frame: CGRect(x: 0, y: 0, width: 15, height: 15))
        clearButton.setImage(UIImage(named: "clear.png")!, for: .normal)
        
        self.rightView = clearButton
        clearButton.addTarget(self, action: #selector(CustomTextField.clearClicked(_:)), for: .touchUpInside)
        
        self.clearButtonMode = .never
        self.rightViewMode = .always
    }
    
    @objc func clearClicked(_ sender:UIButton)
    {
        self.text = ""
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
}
