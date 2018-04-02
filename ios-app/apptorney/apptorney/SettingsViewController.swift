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
    override func viewDidLoad() {
        super.viewDidLoad()
        self.signOut.layer.cornerRadius = self.signOut.frame.height/6

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
