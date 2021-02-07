//
//  LoginViewController+Extensions.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/13/19.
//  Copyright © 2019 Muchu Kaingu. All rights reserved.
//
import Foundation
import SkyFloatingLabelTextField

extension LoginViewController {
    func validatePhone(_ candidate: String) -> Bool {
        let numberRegEx = "^\\+?[\\/.()-]*([0-9][\\/.()-]*){11,}$"
        return NSPredicate(format: "SELF MATCHES %@", numberRegEx).evaluate(with: candidate)
    }
    
    func validatePhoneTextFieldWithText(number: String?) {
        guard let number = number else {
            txtUserName.errorMessage = nil
            return
        }
        
        if number.isEmpty {
            txtUserName.errorMessage = nil
        } else if !validatePhone(number) {
            txtUserName.errorMessage = NSLocalizedString(
                "Enter Number with Country Code",
                tableName: "SkyFloatingLabelTextField",
                comment: " "
            )
            formValid = false
        } else {
            txtUserName.errorMessage = nil
        }
    }
    
}

extension LoginViewController : UITextFieldDelegate {
    func addToolBar(textField: UITextField){
        let toolBar = UIToolbar()
        toolBar.barStyle = UIBarStyle.default
        toolBar.isTranslucent = true
        toolBar.tintColor = UIColor.black
        let signInButton = UIBarButtonItem(title: "Sign In", style: UIBarButtonItemStyle.done, target: self, action: Selector(("donePressed")))
        let signUpButton = UIBarButtonItem(title: "Sign Up", style: UIBarButtonItemStyle.plain, target: self, action: Selector(("cancelPressed")))
        let forgotPasswordButton = UIBarButtonItem(title: "Forgot Your Password?", style: UIBarButtonItemStyle.plain, target: self, action: Selector(("cancelPressed")))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil)
        toolBar.setItems([signInButton, signUpButton, spaceButton, forgotPasswordButton], animated: false)
        toolBar.isUserInteractionEnabled = true
        toolBar.sizeToFit()
        
        textField.delegate = self
        textField.inputAccessoryView = toolBar
    }
    func donePressed(){
        view.endEditing(true)
    }
    func cancelPressed(){
        view.endEditing(true) // or do something
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                if floatingLabelTextField.textContentType == .telephoneNumber{
                    validatePhoneTextFieldWithText(number: text)
                }
                floatingLabelTextField.errorMessage = nil
            }
        }
        return true
    }
    
    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        if textField.text != nil {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
               if floatingLabelTextField.textContentType == .telephoneNumber{
                    var phoneNumber = txtUserName.text
                    phoneNumber = phoneNumber?.trimmingCharacters(in: .whitespacesAndNewlines)
                    phoneNumber = phoneNumber?.trimmingCharacters(in: .punctuationCharacters)
                    phoneNumber = phoneNumber?.deletingPrefix("00")
                    phoneNumber = phoneNumber?.replacingOccurrences(of: " ", with: "")
                    txtUserName.text = phoneNumber
                    validatePhoneTextFieldWithText(number: phoneNumber)
                }
                
            }
        }
        
        return true
    }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        print("return pressed")
        return true
    }
    
    
    
}

