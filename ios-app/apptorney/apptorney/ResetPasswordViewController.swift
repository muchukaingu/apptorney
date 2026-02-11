//
//  ResetPasswordViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/17/19.
//  Copyright © 2019 Muchu Kaingu. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import MaterialComponents.MaterialSnackbar

class ResetPasswordViewController: UIViewController {
    
    @objc var moveToPoint: CGFloat = 0.0
    
    @IBOutlet weak var scrollView: UIScrollView!
    
    @IBOutlet weak var resetPasswordButton: UIButton!
    
    @IBOutlet weak var txtOTP: SkyFloatingLabelTextField!
    @IBOutlet weak var txtNewPassword: SkyFloatingLabelTextField!
    @IBOutlet weak var txtConfirmNewPassword: SkyFloatingLabelTextField!
    var username: String = ""

    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        
        registerForKeyboardNotifications()
        
        if self.view.bounds.size.height > 812.0 || self.view.bounds.size.height > 896.0 {
            moveToPoint =  34.0
        }
        else {
            moveToPoint = 0.0
        }

        // Do any additional setup after loading the view.
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

    @IBAction func resetPassword(_ sender: Any) {
        let user = Appuser()
   
        self.resetPasswordButton.setTitle("Please Wait...", for: .normal)
        user.resetPassword(username: self.username, token: txtOTP.text, password: txtNewPassword.text, completionHandler: {(result, error) in
            if error != nil {
                let retrievedError = error! as NSError
                print(retrievedError.domain)
                //self.showVerifyError(errorText: "Password reset request failed. Please try again.", type: "error")
                //self.verifySpinner.stopAnimating()
                //self.verifyButton.setTitle("Verify", for: .normal)
                
                
            }
            else {
                print("Request successful")
                let message = MDCSnackbarMessage()
                message.text = "Successful. Please sign in."
            
                MDCSnackbarManager.show(message)
                //let userDefaults = UserDefaults.standard
                //userDefaults.set(true, forKey: "loginComplete")
                //userDefaults.set(self.username, forKey: "username")
                //userDefaults.synchronize()
                self.performSegue(withIdentifier: "login", sender: self)
                
            }
        })
    }
    
    
    //MARK: - Keyboard Behavior
    
    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(keyboardWasShown), name: UIResponder.keyboardWillShowNotification, object: nil)
        defaultCenter.addObserver(self, selector: #selector(keyboardWillBeHidden), name: UIResponder.keyboardWillHideNotification, object: nil)
    }
    
    
    @objc func keyboardWasShown(aNotification: Notification) {
        //self.signInButton.alpha = 0
        //self.smallSignInButton.alpha = 1
        let userInfo = aNotification.userInfo
        let keyboardScreenEndFrame = (userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)
        
        scrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
        scrollView.scrollIndicatorInsets = scrollView.contentInset
        
        
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.5, options: [], animations: {
            
            //            self.logoImageView.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
            //            self.logoImageView.transform = CGAffineTransform(translationX: 0, y: self.moveToPoint)
            //self.logoImageView.alpha = 0
            //self.logoImageView.transform = CGAffineTransform.identity.translatedBy(x: 0, y: self.moveToPoint).scaledBy(x: 0.7, y: 0.7)
            self.resetPasswordButton.transform = CGAffineTransform(translationX: 0, y: -keyboardViewEndFrame.height + self.moveToPoint)
            
            
        }, completion:nil)
    }
    
    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
        
        
        
    }
    
    
}
