//
//  CustomImageTitleTableViewCell.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/25/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class CustomImageTitleTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel:UILabel!
    @IBOutlet weak var directionIndicatorImage:UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
