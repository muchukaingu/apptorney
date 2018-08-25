//
//  SubscriptionRenewalVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/17/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class SubscriptionRenewalVC: UIViewController {

   
    @IBOutlet weak var renewButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.renewButton.layer.cornerRadius = self.renewButton.frame.height/6
        //UINavigationBar.appearance().shadowImage = UIImage()
        //UINavigationBar.appearance().setBackgroundImage(UIImage(), for: .default)
        navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.setValue(true, forKey: "hidesShadow")
       
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
