//
//  LoginViewController+Extensions.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/13/19.
//  Copyright © 2019 Muchu Kaingu. All rights reserved.
//

import Foundation

extension LoginViewController : UITextFieldDelegate {
    func addToolBar(textField: UITextField){
        let toolBar = UIToolbar()
        toolBar.barStyle = UIBarStyle.default
        toolBar.isTranslucent = true
        toolBar.tintColor = UIColor.black
        var signInButton = UIBarButtonItem(title: "Sign In", style: UIBarButtonItemStyle.done, target: self, action: "donePressed")
        var signUpButton = UIBarButtonItem(title: "Sign Up", style: UIBarButtonItemStyle.plain, target: self, action: "cancelPressed")
        var forgotPasswordButton = UIBarButtonItem(title: "Forgot Your Password?", style: UIBarButtonItemStyle.plain, target: self, action: "cancelPressed")
        var spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil)
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
}

