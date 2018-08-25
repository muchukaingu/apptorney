//
//  SummaryTableViewCell.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/27/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class SummaryTableViewCell: UITableViewCell {
    @IBOutlet weak var name:UILabel!
    @IBOutlet weak var summary:UILabel?
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var icon: UIImageView!
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        self.containerView.layer.cornerRadius = 8.0
        self.containerView.layer.shadowRadius = 8.0
        self.containerView.layer.shadowOpacity = 0.1
        self.containerView.layer.shadowOffset = CGSize(width: 2, height: 2)
        self.name.sizeToFit()
        self.summary?.sizeToFit()
        self.clipsToBounds = false
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }

}
