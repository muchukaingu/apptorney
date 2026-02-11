//
//  ProductDetailsTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/3/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class StoresTableViewCell: UITableViewCell {
    
    @IBOutlet weak var fieldLabel1: UILabel!
    @IBOutlet weak var connectionStatus: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        //buttonEdit.addTarget(self.revealViewController(), action: "revealToggle:", forControlEvents: UIControl.Event.TouchUpInside)
        
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
    
    
    
}
