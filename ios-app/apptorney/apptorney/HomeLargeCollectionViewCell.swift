//
//  homeLargeCollectionViewCell.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/11/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class HomeLargeCollectionViewCell: UICollectionViewCell {
    @IBOutlet weak var name:UILabel!
    @IBOutlet weak var summary:UILabel!
    @IBOutlet weak var bookmarkImage: UIImageView!
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        self.layer.cornerRadius = 8.0
        layer.shadowRadius = 8.0
        layer.shadowOpacity = 0.2
        layer.shadowOffset = CGSize(width: 2, height: 4)
        self.name.sizeToFit()
        self.summary.sizeToFit()
        self.clipsToBounds = false
    }
}


