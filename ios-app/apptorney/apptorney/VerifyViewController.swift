//
//  VerifyViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/13/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class VerifyViewController: UIViewController {
    
    var username = ""
    @IBOutlet weak var txtVerificationCode:UITextField!
    @IBOutlet weak var verifyButton: UIButton!
    @IBOutlet weak var verifySpinner: UIActivityIndicatorView!
    @IBOutlet weak var verifyErrorLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        print("In verify")
        self.verifyButton.layer.cornerRadius = self.verifyButton.frame.height/6
        self.verifyButton.clipsToBounds = true

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    @IBAction func verify(_ sender: Any) {
        self.hideVerifyError()
        self.verifySpinner.startAnimating()
        self.verifyButton.setTitle("Verifying...", for: .normal)
        let defaults: UserDefaults = UserDefaults.standard
        let user = Appuser()
        user.verify(username: self.username, token: txtVerificationCode.text, completionHandler:{(result,error) in
            
            if error != nil {
                let retrievedError = error as! NSError
                print(retrievedError.domain)
                self.showVerifyError(errorText: "Verification failed. Please try again.", type: "error")
                self.verifySpinner.stopAnimating()
                self.verifyButton.setTitle("Verify", for: .normal)
                
                
            }
            else {
                print("Verification successful")
                let userDefaults = UserDefaults.standard
                userDefaults.set(true, forKey: "loginComplete")
                userDefaults.set(self.username, forKey: "username")
                userDefaults.synchronize()
                self.performSegue(withIdentifier: "Verified", sender: self)
                
            }
        })
        
    }
    
   
    @IBAction func resendVerificationCode(_ sender: Any) {
        let user = Appuser()
        user.resendVerification(username: self.username, completionHandler:{(result,error) in
            
            if error != nil {
                let retrievedError = error as! NSError
                print(retrievedError.domain)
                self.showVerifyError(errorText: "An error occured. Please try again.", type: "error")
                self.verifySpinner.stopAnimating()
                self.verifyButton.setTitle("Verify", for: .normal)
                
                
            }
            else {
                self.showVerifyError(errorText: "Code successfully sent. Check your SMS inbox.", type: "success")
                self.verifySpinner.stopAnimating()
                
            }
        })
    }
    
    @objc func showVerifyError(errorText: String, type: String?){
        if type == "success" {
            self.verifyErrorLabel.backgroundColor = UIColor.green
        }
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.verifyErrorLabel.text = errorText
            self.verifyErrorLabel.alpha = 1.0
            //self.closeErrorButton.alpha = 1.0
        }, completion:nil)
    }
    
    @IBAction func hideVerifyError(){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.verifyErrorLabel.text = ""
            self.verifyErrorLabel.alpha = 0.0
            //self.closeErrorButton.alpha = 0.0
            
        }, completion:nil)
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
