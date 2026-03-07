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
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
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
}

extension RegisterViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                if floatingLabelTextField.textContentType == .emailAddress {
                    validateEmailTextFieldWithText(email: text)
                }
                floatingLabelTextField.errorMessage = nil
            }
        }
        return true
    }

    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool {
        if let text = textField.text {
            if let floatingLabelTextField = textField as? SkyFloatingLabelTextField {
                if floatingLabelTextField.textContentType == .emailAddress {
                    validateEmailTextFieldWithText(email: text)
                }
            }
        }
        return true
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        return true
    }
}
