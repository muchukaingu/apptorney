//
//  StatusTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/25/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class StatusTableViewCell: UITableViewCell {
    
    @IBOutlet weak var fieldLabel1: UILabel!
    @IBOutlet weak var status: UISwitch!
    @IBOutlet weak var valueLabel1: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
