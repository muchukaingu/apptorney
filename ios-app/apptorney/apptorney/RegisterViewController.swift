//
//  RegisterViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/12/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import Alamofire
import PhoneNumberKit
import MaterialComponents.MaterialSnackbar

class RegisterViewController: UIViewController {
    @objc var moveToPoint: CGFloat = 0.0
    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var logoImageView: UIImageView!
    @IBOutlet weak var txtFirstName: SkyFloatingLabelTextField!
    @IBOutlet weak var txtLastName: SkyFloatingLabelTextField!
    @IBOutlet weak var txtOrganization: SkyFloatingLabelTextField!
    @IBOutlet weak var txtPhoneNumber: SkyFloatingLabelTextField!
    @IBOutlet weak var txtEmailAddress: SkyFloatingLabelTextField!
    @IBOutlet weak var txtPassword: SkyFloatingLabelTextField!
    @IBOutlet weak var txtPasswordConfirmation: SkyFloatingLabelTextField!
    @IBOutlet weak var signInButton: UIButton!
    @IBOutlet weak var smallSignInButton: UIButton!
    @IBOutlet weak var signUpLabel: UILabel!
    @IBOutlet weak var signUpSpinner: UIActivityIndicatorView!
    @IBOutlet weak var signUpError: UILabel!
    var formValid: Bool = false
    let user = Appuser()
    @IBOutlet weak var containerView: UIView!
    
    @IBOutlet weak var scrollView: UIScrollView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor=UIColor.white
        //self.signUpButton.layer.cornerRadius = self.signUpButton.frame.height/6
        
        self.txtEmailAddress.textContentType = .emailAddress
        self.txtPhoneNumber.textContentType = .telephoneNumber
        self.txtPassword.textContentType = .URL
        
        
        
        
        
        
        for case let textField as SkyFloatingLabelTextField in self.containerView.subviews {
            if textField.textContentType != .emailAddress {
                textField.autocapitalizationType = .words
            }
            textField.titleFormatter = { $0 }
            //addToolBar(textField: textField)
            textField.delegate = self
        }
        
        print(self.view.bounds.height)
     

        // Do any additional setup after loading the view.
        registerForKeyboardNotifications()
       /* if self.view.bounds.size.height < 568.0 {
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
 
 */
        if self.view.bounds.size.height > 812.0 || self.view.bounds.size.height > 896.0 {
            moveToPoint =  34.0
        }
        else {
            moveToPoint = 0.0
        }
        
     
        
        
        UIView.animate(withDuration: 0.2, delay: 1.4, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            
            self.txtFirstName.alpha = 1.0
            self.txtLastName.alpha = 1.0
            self.txtPhoneNumber.alpha = 1.0
             self.txtEmailAddress.alpha = 1.0
            self.txtPassword.alpha = 1.0
            self.signUpButton.alpha = 1.0
            //self.signInButton.alpha = 1.0
            //self.signUpLabel.alpha = 1.0
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.txtFirstName.becomeFirstResponder()
            }
        }, completion:nil)
    }
    
  

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(keyboardWasShown), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        defaultCenter.addObserver(self, selector: #selector(keyboardWillBeHidden), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    @objc func keyboardWasShown(aNotification: Notification) {
        //self.signInButton.alpha = 0
        //self.smallSignInButton.alpha = 1
        let userInfo = aNotification.userInfo
        let keyboardScreenEndFrame = (userInfo?[UIKeyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)
        
        scrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
        scrollView.scrollIndicatorInsets = scrollView.contentInset
        
        
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.5, options: [], animations: {
            
            //            self.logoImageView.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
            //            self.logoImageView.transform = CGAffineTransform(translationX: 0, y: self.moveToPoint)
            //self.logoImageView.alpha = 0
            //self.logoImageView.transform = CGAffineTransform.identity.translatedBy(x: 0, y: self.moveToPoint).scaledBy(x: 0.7, y: 0.7)
            self.signUpButton.transform = CGAffineTransform(translationX: 0, y: -keyboardViewEndFrame.height + self.moveToPoint)
            
            
        }, completion:nil)
    }
    
    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
        
     
        
    }
    
    @objc func showSignUpError(errorText: String){
//        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
//            self.signUpError.text = errorText
//            self.signUpError.alpha = 1.0
//            //self.closeErrorButton.alpha = 1.0
//        }, completion:nil)
        
        let message = MDCSnackbarMessage()
        message.text = errorText
        MDCSnackbarManager.show(message)
    }
    
    @IBAction func hideSignUpError(){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            //self.signUpError.text = ""
            //self.signUpError.alpha = 0.0
            //self.closeErrorButton.alpha = 0.0
            
        }, completion:nil)
    }
    
    func validateForm()->Bool{
        formValid = true
        for case let textField as SkyFloatingLabelTextField in self.containerView.subviews {
            
            if(textField.textContentType == .emailAddress) {
                validateEmailTextFieldWithText(email: textField.text)
            }
            else if textField.textContentType == .telephoneNumber{
                validatePhoneTextFieldWithText(number: textField.text)
            }
            else if textField.textContentType == .URL{
                if textField.text!.count < 6{
                    formValid = false
                    textField.errorMessage = NSLocalizedString(
                        "at least 6 characters required",
                        tableName: "SkyFloatingLabelTextField",
                        comment: " "
                    )
                }
                
            }
            
            
            if textField.text == "" {
                textField.errorMessage = NSLocalizedString(
                    "\(textField.placeholder!) is required",
                    tableName: "SkyFloatingLabelTextField",
                    comment: " "
                )
                
                formValid = false
                
            }
            
        }
        
        if let password = txtPassword.text{
            if let confirmation = txtPasswordConfirmation.text {
                if password != confirmation {
                    let error = NSLocalizedString(
                        "Password mismatch",
                        tableName: "SkyFloatingLabelTextField",
                        comment: " "
                    )
                    txtPassword.errorMessage = error
                    txtPasswordConfirmation.errorMessage = error
                    formValid = false
                }
                else {
                    txtPassword.errorMessage = nil
                    txtPasswordConfirmation.errorMessage = nil
                }
            }
        }
        
        
        return formValid
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        
        if segue.identifier == "Verification" {
            
            let destinationController = segue.destination as!
            VerifyViewController
            destinationController.username = user.phoneNumber ?? ""
        }
        
        
        
    }
    
    
    @IBAction func register() {
        let phoneNumberKit = PhoneNumberKit()
        if !validateForm(){
            
        } else {
            self.hideSignUpError()
            //self.signUpSpinner.startAnimating()
            self.signUpButton.setTitle("Signing up...", for: .normal)
            
            user.firstName = txtFirstName!.text
            user.lastName = txtLastName!.text
            user.phoneNumber = txtPhoneNumber!.text
            do {
               let phoneNumber = try phoneNumberKit.parse(user.phoneNumber ?? "")
               user.phoneNumber = phoneNumberKit.format(phoneNumber, toType: .e164).replacingOccurrences(of: "+", with: "")
               print("xxx: " + user.phoneNumber!)
            }
            catch {
                print("Generic parser error")
            }
            user.emailAddress = txtEmailAddress!.text
            user.password = txtPassword!.text
            user.register(user: user, completionHandler:{(result,error) in
                
                if error != nil {
                    var errorText: String?
                    if let error = error as? AFError {
                        print ("Localized Description: \(error.localizedDescription), Error Description \(error.errorDescription) \(error.underlyingError?.localizedDescription)")
                        switch error {
                        case .invalidURL(let url):
                            print("Invalid URL: \(url) - \(error.localizedDescription)")
                            errorText = "Sign up failed. Please try again."
                        case .parameterEncodingFailed(let reason):
                            print("Parameter encoding failed: \(error.localizedDescription)")
                            print("Failure Reason: \(reason)")
                            errorText = "Sign up failed. Please try again."
                        case .multipartEncodingFailed(let reason):
                            print("Multipart encoding failed: \(error.localizedDescription)")
                            print("Failure Reason: \(reason)")
                            errorText = "Sign up failed. Please try again."
                        case .responseValidationFailed(let reason):
                            print("Response validation failed: \(error.localizedDescription)")
                            print("Failure Reason: \(reason)")
                            
                            switch reason {
                            case .dataFileNil, .dataFileReadFailed:
                                print("Downloaded file could not be read")
                            case .missingContentType(let acceptableContentTypes):
                                print("Content Type Missing: \(acceptableContentTypes)")
                            case .unacceptableContentType(let acceptableContentTypes, let responseContentType):
                                print("Response content type: \(responseContentType) was unacceptable: \(acceptableContentTypes)")
                            case .unacceptableStatusCode(let code):
                                if code == 409 {
                                    errorText = "Sign up failed. An account already exists."
                                } else {
                                    errorText = "Sign up failed. Please contact info@apptorney.org"
                                }
                                
                            }
                        case .responseSerializationFailed(let reason):
                            print("Response serialization failed: \(error.localizedDescription)")
                            print("Failure Reason: \(reason)")
                        }
                        
                        print("Underlying error: \(String(describing: error.underlyingError))")
                    } else {
                        print("Unknown error: \(String(describing: errorText))")
                    }
                   
                    self.showSignUpError(errorText: errorText ?? "")
                    //self.signUpSpinner.stopAnimating()
                    self.signUpButton.setTitle("Sign Up", for: .normal)
                    
                    
                }
                else {
                    print("Sign up successful")
                    let userDefaults = UserDefaults.standard
                    userDefaults.set(true, forKey: "registrationComplete")
                    userDefaults.set(true, forKey: "loginComplete")
                    
                    userDefaults.set(self.txtPhoneNumber.text, forKey: "username")
                    userDefaults.synchronize()
                    
                    self.performSegue(withIdentifier: "Registered", sender: self)
                    
                }
            })
        }
        
    }
    
    
    @IBAction func returnToSignIn(){
        let userDefaults = UserDefaults.standard
       
        
        if userDefaults.bool(forKey: "loggedOut") {
            
            print("dismissed mf")
            self.dismiss(animated: true, completion: nil)
           
        } else {
            
            self.performSegue(withIdentifier: "signIn", sender: self)
        }
    }
    
    
}

