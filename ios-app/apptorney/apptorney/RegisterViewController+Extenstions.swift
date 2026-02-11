//
//  RegisterViewController+Extenstions.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/30/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import Foundation
import SkyFloatingLabelTextField

extension RegisterViewController {
    func validateEmail(_ candidate: String) -> Bool {
        let emailRegEx = "(?:[a-zA-Z0-9!#$%\\&‘*+/=?\\^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%\\&'*+/=?\\^_`{|}" +
            "~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\" +
            "x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-" +
            "z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5" +
            "]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-" +
            "9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21" +
        "-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
        return NSPredicate(format: "SELF MATCHES %@", emailRegEx).evaluate(with: candidate)
    }
    
    func validateEmailTextFieldWithText(email: String?) {
        guard let email = email else {
            txtEmailAddress.errorMessage = nil
            return
        }
        
        if email.isEmpty {
            txtEmailAddress.errorMessage = nil
        } else if !validateEmail(email) {
            txtEmailAddress.errorMessage = NSLocalizedString(
                "Enter a valid email address",
                tableName: "SkyFloatingLabelTextField",
                comment: " "
            )
            formValid = false
            
        } else {
            txtEmailAddress.errorMessage = nil
        }
    }
    
    
    func validatePhone(_ candidate: String) -> Bool {
        let numberRegEx = "^\\+?[\\/.()-]*([0-9][\\/.()-]*){11,}$"
        return NSPredicate(format: "SELF MATCHES %@", numberRegEx).evaluate(with: candidate)
    }
    
    func validatePhoneTextFieldWithText(number: String?) {
        guard let number = number else {
            txtPhoneNumber.errorMessage = nil
            return
        }
        
        if number.isEmpty {
            txtPhoneNumber.errorMessage = nil
        } else if !validatePhone(number) {
            txtPhoneNumber.errorMessage = NSLocalizedString(
                "Enter Number with Country Code",
                tableName: "SkyFloatingLabelTextField",
                comment: " "
            )
            formValid = false
        } else {
            txtPhoneNumber.errorMessage = nil
        }
    }
    
    func validatePassword(_ candidate: String) -> Bool {
        let emailRegEx = "(?:[a-zA-Z0-9!#$%\\&‘*+/=?\\^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%\\&'*+/=?\\^_`{|}" +
            "~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\" +
            "x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-" +
            "z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5" +
            "]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-" +
            "9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21" +
        "-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
        
        return NSPredicate(format: "SELF MATCHES %@", emailRegEx).evaluate(with: candidate)
    }
    
    func validatePasswordTextFieldWithText(email: String?) {
        guard let email = email else {
            txtEmailAddress.errorMessage = nil
            return
        }
        
        if email.isEmpty {
            txtEmailAddress.errorMessage = nil
        } else if !validateEmail(email) {
            txtEmailAddress.errorMessage = NSLocalizedString(
                "At least 6 characters",
                tableName: "SkyFloatingLabelTextField",
                comment: " "
            )
        } else {
            txtEmailAddress.errorMessage = nil
        }
    }
    
    func validateOtherFields(_ textField: SkyFloatingLabelTextField){
        if textField.textContentType == UITextContentType.URL && textField.text!.count > 6 {
            print("yebo")
            textField.errorMessage = nil
        } else if textField.text!.count > 0 {
            textField.errorMessage = nil
        }
    }
}

extension RegisterViewController : UITextFieldDelegate {
    func addToolBar(textField: UITextField){
        let toolBar = UIToolbar()
        toolBar.barStyle = .default
        toolBar.isTranslucent = true
        toolBar.tintColor = UIColor.black
        let signUpButton = UIBarButtonItem(title: "Sign In", style: .done, target: self, action: #selector(donePressed))
       
       
        toolBar.setItems([signUpButton], animated: false)
        toolBar.isUserInteractionEnabled = true
        toolBar.sizeToFit()
        
        textField.delegate = self
        textField.inputAccessoryView = toolBar
    }
    @objc func donePressed(){
        view.endEditing(true)
    }
    func cancelPressed(){
        view.endEditing(true) // or do something
    }
    
    
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                if(floatingLabelTextField.textContentType == .emailAddress) {
                    validateEmailTextFieldWithText(email: text)
                }
                else if floatingLabelTextField.textContentType == .telephoneNumber{
                    validatePhoneTextFieldWithText(number: text)
                }
                else if floatingLabelTextField.placeholder == "Password" || floatingLabelTextField.placeholder == "Password Confirmation" {
                    //print("password")
                }
                else {
                    validateOtherFields(floatingLabelTextField)
                }
                floatingLabelTextField.errorMessage = nil
            }
        }
        return true
    }
    
    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                if(floatingLabelTextField.textContentType == .emailAddress) {
                    validateEmailTextFieldWithText(email: text)
                }
                else if floatingLabelTextField.textContentType == .telephoneNumber{
                    var phoneNumber = txtPhoneNumber.text
                    phoneNumber = phoneNumber?.trimmingCharacters(in: .whitespacesAndNewlines)
                    phoneNumber = phoneNumber?.trimmingCharacters(in: .punctuationCharacters)
                    phoneNumber = phoneNumber?.deletingPrefix("00")
                    phoneNumber = phoneNumber?.replacingOccurrences(of: " ", with: "")
                    txtPhoneNumber.text = phoneNumber
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
