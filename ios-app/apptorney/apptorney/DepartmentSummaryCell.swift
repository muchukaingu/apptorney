//
//  ProductDetailsTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/3/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class DepartmentSummaryCell: UITableViewCell {
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var positiveStockLabel: UILabel!
    @IBOutlet weak var negativeStockLabel: UILabel!
    @IBOutlet weak var dormantStockLabel: UILabel!
    @IBOutlet weak var totalStockLabel: UILabel!
    @IBOutlet weak var openingStockLabel: UILabel!
    @IBOutlet weak var rangeSoldLabel: UILabel!
    @IBOutlet weak var MagicMixLabel: UILabel!
    @IBOutlet weak var ModelLabel: UILabel!
    @IBOutlet weak var departmentIcon: UIImageView!
    
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
