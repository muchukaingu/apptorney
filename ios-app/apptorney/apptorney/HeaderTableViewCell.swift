//
//  HeaderTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/6/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class HeaderTableViewCell: UITableViewCell {
    @IBOutlet weak var title: UILabel!
    @IBOutlet weak var seeAllBtn: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    var tapObject : (() -> Void)? = nil
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

    @IBAction func seeAll(_ sender: Any) {
        if let btnAction = self.tapObject {
            btnAction()
        }
    }
}
