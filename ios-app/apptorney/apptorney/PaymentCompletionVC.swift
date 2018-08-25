//
//  paymentCompletionVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/19/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class PaymentCompletionVC: UIViewController {
    @IBOutlet weak var completionButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
         self.completionButton.layer.cornerRadius = self.completionButton.frame.height/4

        // Do any additional setup after loading the view.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
