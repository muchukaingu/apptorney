//
//  ProductDetailsTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/3/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class CategoryTableViewCell: UITableViewCell {
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var positiveStockLabel: UILabel!
    @IBOutlet weak var negativeStockLabel: UILabel!
    @IBOutlet weak var dormantStockLabel: UILabel!
    @IBOutlet weak var totalStockLabel: UILabel!
        
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        //buttonEdit.addTarget(self.revealViewController(), action: "revealToggle:", forControlEvents: UIControlEvents.TouchUpInside)
        
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
    
    
}
