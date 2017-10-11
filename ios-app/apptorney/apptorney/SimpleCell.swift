//
//  SimpleCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/7/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class SimpleCell: UITableViewCell {
    @IBOutlet weak var fieldLabel1: UILabel!
    @IBOutlet weak var valueLabel1: UILabel!
    @IBOutlet weak var icon: UIImageView!
    @IBOutlet weak var valueText1: UITextField!
    @IBOutlet weak var fieldLabel2: UILabel!
    @IBOutlet weak var valueLabel2: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
