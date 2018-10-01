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
                destinationController.navigationController?.title = "xxx"
                
                
                
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
    
    
    @IBAction func subscribe(_ sender: Any) {
        IAPHandler.shared.purchaseMyProduct(index: 0)
    }

}
