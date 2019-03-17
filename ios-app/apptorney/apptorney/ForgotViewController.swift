//
//  PasswordResetViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/17/19.
//  Copyright © 2019 Muchu Kaingu. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField

class ForgotViewController: UIViewController {
    

   
    @IBOutlet weak var txtPhoneNumber: SkyFloatingLabelTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    
    
    @IBAction func requestPasswordReset(_ sender: Any) {
        
        //let defaults: UserDefaults = UserDefaults.standard
        let user = Appuser()
        user.requestPasswordReset(username: txtPhoneNumber.text, completionHandler:{(result,error) in
            
            if error != nil {
                let retrievedError = error! as NSError
                print(retrievedError.domain)
                //self.showVerifyError(errorText: "Password reset request failed. Please try again.", type: "error")
                //self.verifySpinner.stopAnimating()
                //self.verifyButton.setTitle("Verify", for: .normal)
                
                
            }
            else {
                print("Request successful")
                //let userDefaults = UserDefaults.standard
                //userDefaults.set(true, forKey: "loginComplete")
                //userDefaults.set(self.username, forKey: "username")
                //userDefaults.synchronize()
                self.performSegue(withIdentifier: "reset", sender: self)
                
            }
        })
        
    }
    

    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
        if segue.identifier == "reset" {
            
            let destinationController = segue.destination as!
            ResetPasswordViewController
            destinationController.username = txtPhoneNumber.text ?? ""
        }
        
    }
 

}
