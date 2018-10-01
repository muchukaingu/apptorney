//
//  SettingsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 4/2/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class SettingsViewController: UIViewController {
    @IBOutlet weak var signOut: UIButton!
    @IBOutlet weak var subscribeBtn: UIButton!
    
    @IBOutlet weak var subscriptionContainer: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.signOut.layer.cornerRadius = self.signOut.frame.height/6
        self.subscribeBtn.layer.cornerRadius = self.subscribeBtn.frame.height/6
        
        self.subscriptionContainer.layer.cornerRadius = self.subscriptionContainer.frame.height/15
        
        IAPHandler.shared.fetchAvailableProducts()
        IAPHandler.shared.purchaseStatusBlock = {[weak self] (type) in
            guard let strongSelf = self else{ return }
            if type == .purchased {
                let alertView = UIAlertController(title: "", message: type.message(), preferredStyle: .alert)
                let action = UIAlertAction(title: "OK", style: .default, handler: { (alert) in
                    
                })
                alertView.addAction(action)
                strongSelf.present(alertView, animated: true, completion: nil)
            }
        }

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
   
    
    @IBAction func subscribe(_ sender: Any) {
        IAPHandler.shared.purchaseMyProduct(index: 0)
    }
    
    
    @IBAction func signOut(_ sender: Any) {
        navigationController?.setNavigationBarHidden(true, animated: false)
        let userDefaults = UserDefaults.standard
        userDefaults.set(false, forKey: "loginComplete")
        userDefaults.set(true, forKey: "registrationComplete")
        userDefaults.removeObject(forKey: "name")
        userDefaults.synchronize()
        
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
