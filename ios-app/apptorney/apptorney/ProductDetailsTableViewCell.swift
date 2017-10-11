//
//  ProductDetailsTableViewCell.swift
//  MR
//
//  Created by Muchu Kaingu on 3/3/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

class ProductDetailsTableViewCell: UITableViewCell {

    @IBOutlet weak var fieldLabel1: UILabel!
    @IBOutlet weak var valueLabel1: UILabel!
    @IBOutlet weak var fieldLabel2: UILabel!
    @IBOutlet weak var valueLabel2: UILabel!
    @IBOutlet weak var valueLabel3: UILabel!
    @IBOutlet weak var valueLabel4: UILabel!
    @IBOutlet weak var valueLabel5: UILabel!
    @IBOutlet weak var fieldLabel3: UILabel!
    @IBOutlet weak var valueLabel6: UILabel!
    @IBOutlet weak var fieldLabel4: UILabel!
    @IBOutlet weak var promoStatus: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        //buttonEdit.addTarget(self.revealViewController(), action: "revealToggle:", forControlEvents: UIControlEvents.TouchUpInside)
    
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    @objc func showROS(){
        print("Label Tapped!")
        let alert = UIAlertView(title: "Rate of Sale", message: "Rate of Sale", delegate: self, cancelButtonTitle: "OK")
        alert.show()
    }
    



}
