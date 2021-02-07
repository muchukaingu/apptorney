//
//  InfoVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/6/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class InfoVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationItem.hidesSearchBarWhenScrolling = false
          
            
            //search black screen fix
            self.definesPresentationContext = true
            navigationItem.largeTitleDisplayMode = .automatic
            navigationController?.navigationBar.sizeToFit()
           
            
        } else {
            // Fallback on earlier versions
            print("show normal bar")
        }

        // Do any additional setup after loading the view.
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // Show the navigation bar on other view controllers
        self.navigationController?.setNavigationBarHidden(false, animated: animated)
//        self.navigationController?.isNavigationBarHidden = false
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
    
    @IBAction func signOut(_ sender: Any) {
        navigationController?.setNavigationBarHidden(true, animated: false)
        let userDefaults = UserDefaults.standard
        userDefaults.set(false, forKey: "loginComplete")
        userDefaults.set(true, forKey: "loggedOut")
        userDefaults.set(true, forKey: "registrationComplete")
        userDefaults.removeObject(forKey: "name")
        userDefaults.synchronize()
        self.performSegue(withIdentifier: "logOut", sender: self)
        
    }

 

}
