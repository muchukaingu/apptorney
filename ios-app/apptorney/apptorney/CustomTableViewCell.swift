//
//  CustomTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class CustomTableViewCell: UITableViewCell {

    @IBOutlet weak var mainLabel: UILabel!
    @IBOutlet weak var subTitleLabel: UILabel!
    @IBOutlet weak var smallSubTitleLeft: EdgeInsetLabel! 
    @IBOutlet weak var smallSubTitleRight: UILabel!
    @IBOutlet weak var containerView: UIView!
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        self.containerView.layer.cornerRadius = 8.0
        self.containerView.layer.shadowRadius = 8.0
        self.containerView.layer.shadowOpacity = 0.1
        self.containerView.layer.shadowOffset = CGSize(width: 2, height: 2)
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
