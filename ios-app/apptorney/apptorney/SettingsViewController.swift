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
        self.performSegue(withIdentifier: "logOut", sender: self)
        
    }
    
    // MARK: - Navigation
    
    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showTerms" {
            
            let legislation:Legislation
            legislation = Legislation()
            legislation._id = "5badf52b4594190056063cae"
            print("in segue, mofo")
            let destinationController = segue.destination as!
            AgreementDetailsVC
            destinationController.legislationInstance = legislation
            destinationController.navigationController?.setNavigationBarHidden(false, animated: false)
            destinationController.navigationItem.rightBarButtonItems = []
            //destinationController.searchText = self.searchController.searchBar.text!
            if #available(iOS 11.0, *) {
                destinationController.navigationController?.navigationBar.prefersLargeTitles = true
                
                
                
                
            } else {
                // Fallback on earlier versions
                print("show normal bar")
            }
            
        }
            
        else if segue.identifier == "showPrivacy" {
            
            let legislation:Legislation
            legislation = Legislation()
            legislation._id = "5badec9d1a2fa200672d9abe"
            print("in segue, mofo")
            let destinationController = segue.destination as!
            AgreementDetailsVC
            destinationController.legislationInstance = legislation
            //destinationController.searchText = self.searchController.searchBar.text!
        }
    }

   

}
