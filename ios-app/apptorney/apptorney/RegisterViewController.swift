//
//  RegisterViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/12/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class RegisterViewController: UIViewController {
    @objc var moveToPoint: CGFloat = 0.0
    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var logoImageView: UIImageView!
    @IBOutlet weak var txtFirstName: UITextField!
    @IBOutlet weak var txtLastName: UITextField!
    @IBOutlet weak var txtPhoneNumber: UITextField!
    @IBOutlet weak var txtEmailAddress: UITextField!
    @IBOutlet weak var txtPassword: UITextField!
    @IBOutlet weak var signInButton: UIButton!
    @IBOutlet weak var smallSignInButton: UIButton!
    @IBOutlet weak var signUpLabel: UILabel!
    @IBOutlet weak var signUpSpinner: UIActivityIndicatorView!
    @IBOutlet weak var signUpError: UILabel!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor=UIColor.white
        self.signUpButton.layer.cornerRadius = self.signUpButton.frame.height/6

        // Do any additional setup after loading the view.
        registerForKeyboardNotifications()
        if self.view.bounds.size.height < 568.0 {
            moveToPoint = -155.0
        }
        else if self.view.bounds.size.height >= 568.0 && self.view.bounds.size.height < 667.0{
            moveToPoint = -170.0
        }
        else if self.view.bounds.size.height == 667.0 && self.view.bounds.size.height < 736.0{
            moveToPoint = -190.0
        }
        else if self.view.bounds.size.height == 736.0 {
            moveToPoint = -200.0
        }
        else if self.view.bounds.size.height > 736.0 {
            moveToPoint =  self.view.bounds.size.height / -3.7
        }
        
        UIView.animate(withDuration: 1.6, delay: 0.4, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
            
            //            self.logoImageView.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
            //            self.logoImageView.transform = CGAffineTransform(translationX: 0, y: self.moveToPoint)
            self.logoImageView.alpha = 0
            self.logoImageView.transform = CGAffineTransform.identity.translatedBy(x: 0, y: self.moveToPoint as! CGFloat).scaledBy(x: 0.7, y: 0.7)
            
            
        }, completion:nil)
        
        
        UIView.animate(withDuration: 0.2, delay: 1.4, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            
            self.txtFirstName.alpha = 1.0
            self.txtLastName.alpha = 1.0
            self.txtPhoneNumber.alpha = 1.0
             self.txtEmailAddress.alpha = 1.0
            self.txtPassword.alpha = 1.0
            self.signUpButton.alpha = 1.0
            self.signInButton.alpha = 1.0
            self.signUpLabel.alpha = 1.0
            
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.txtFirstName.becomeFirstResponder()
            }
            
            
        }, completion:nil)
        
        // Do any additional setup after loading the view.
        //        let defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
        //        let userName = defaults.objectForKey("userName") as! String?
        //        let password = defaults.objectForKey("password") as! String?
        //        if userName != "" && password != "" {
        //            loginAttempt("http://41.77.145.134:8888")
        //        }

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(RegisterViewController.keyboardWasShown(_:)), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        defaultCenter.addObserver(self, selector: #selector(RegisterViewController.keyboardWillBeHidden(_:)), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    @objc func keyboardWasShown(_ aNotification: Notification) {
        self.signInButton.alpha = 0
        self.smallSignInButton.alpha = 1
    }
    
    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
        
     
        
    }
    
    @objc func showSignUpError(errorText: String){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.signUpError.text = errorText
            self.signUpError.alpha = 1.0
            //self.closeErrorButton.alpha = 1.0
        }, completion:nil)
    }
    
    @IBAction func hideSignUpError(){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.signUpError.text = ""
            self.signUpError.alpha = 0.0
            //self.closeErrorButton.alpha = 0.0
            
        }, completion:nil)
    }
    
    @IBAction func register() {
        self.hideSignUpError()
        self.signUpSpinner.startAnimating()
        self.signUpButton.setTitle("Signing up...", for: .normal)
        let defaults: UserDefaults = UserDefaults.standard
        let user = Appuser()
        user.firstName = txtFirstName!.text
        user.lastName = txtLastName!.text
        user.phoneNumber = txtPhoneNumber!.text
        user.emailAddress = txtEmailAddress!.text
        user.password = txtPassword!.text
        user.register(user: user, completionHandler:{(result,error) in
            
            if error != nil {
                print(error!)
                self.showSignUpError(errorText: "Sign up failed. Please try again.")
                self.signUpSpinner.stopAnimating()
                self.signUpButton.setTitle("Sign Up", for: .normal)
                
                
            }
            else {
                print("Sign up successful")
                let userDefaults = UserDefaults.standard
                userDefaults.set(true, forKey: "registrationComplete")
                userDefaults.synchronize()
                self.performSegue(withIdentifier: "Verification", sender: self)
                
            }
        })
        
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
