//
//  HomeSmallCallectionViewCellCollectionViewCell.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/20/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit


class HomeSmallCollectionViewCell: UICollectionViewCell {
    @IBOutlet weak var name:UILabel!
    @IBOutlet weak var type:UILabel!
    @IBOutlet weak var placeholders: UIImageView!
    @IBOutlet weak var topPlaceholder: UIImageView!
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.layer.cornerRadius = 8.0
        layer.shadowRadius = 8.0
        layer.shadowOpacity = 0.2
        layer.shadowOffset = CGSize(width: 2, height: 4)
        self.name.sizeToFit()
        self.clipsToBounds = false
    }
}
