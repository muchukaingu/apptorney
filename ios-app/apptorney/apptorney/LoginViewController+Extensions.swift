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
    func validateEmail(_ candidate: String) -> Bool {
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        return NSPredicate(format: "SELF MATCHES %@", emailRegEx).evaluate(with: candidate)
    }

    func validateEmailTextField(email: String?) {
        guard let email = email else {
            txtUserName.errorMessage = nil
            return
        }

        if email.isEmpty {
            txtUserName.errorMessage = nil
        } else if !validateEmail(email) {
            txtUserName.errorMessage = NSLocalizedString(
                "Enter a valid email address",
                tableName: "SkyFloatingLabelTextField",
                comment: " "
            )
            formValid = false
        } else {
            txtUserName.errorMessage = nil
        }
    }
}

extension LoginViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                validateEmailTextField(email: text)
                floatingLabelTextField.errorMessage = nil
            }
        }
        return true
    }

    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        if let text = textField.text {
            if textField as? SkyFloatingLabelTextField != nil {
                validateEmailTextField(email: text)
            }
        }
        return true
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        login()
        return true
    }
}
