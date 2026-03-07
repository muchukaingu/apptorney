//
//  VerifyViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/13/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit
import MaterialComponents.MaterialSnackbar

class VerifyViewController: UIViewController {

    var email = ""
    @IBOutlet weak var txtVerificationCode: UITextField!
    @IBOutlet weak var verifyButton: UIButton!
    @IBOutlet weak var verifySpinner: UIActivityIndicatorView!
    @IBOutlet weak var verifyErrorLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        self.verifyButton.layer.cornerRadius = self.verifyButton.frame.height / 6
        self.verifyButton.clipsToBounds = true

        txtVerificationCode.placeholder = "Enter verification code"
        txtVerificationCode.keyboardType = .numberPad
        txtVerificationCode.textContentType = .oneTimeCode

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.txtVerificationCode.becomeFirstResponder()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Verify OTP

    @IBAction func verify(_ sender: Any) {
        self.hideVerifyError()
        self.verifySpinner.startAnimating()
        self.verifyButton.setTitle("Verifying...", for: .normal)

        let otp = (txtVerificationCode.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)

        guard !otp.isEmpty else {
            self.showVerifyError(errorText: "Please enter the verification code.", type: "error")
            self.verifySpinner.stopAnimating()
            self.verifyButton.setTitle("Verify", for: .normal)
            return
        }

        let user = Appuser()
        user.verifyOtp(email: self.email, otp: otp) { success, error in
            if error != nil {
                self.showVerifyError(errorText: "Verification failed. Please check your code and try again.", type: "error")
                self.verifySpinner.stopAnimating()
                self.verifyButton.setTitle("Verify", for: .normal)
            } else {
                let userDefaults = UserDefaults.standard
                userDefaults.set(true, forKey: "loginComplete")
                userDefaults.set(self.email, forKey: "username")
                userDefaults.synchronize()
                self.performSegue(withIdentifier: "Verified", sender: self)
            }
        }
    }

    // MARK: - Resend OTP

    @IBAction func resendVerificationCode(_ sender: Any) {
        let user = Appuser()
        user.resendOtp(email: self.email) { success, error in
            if error != nil {
                self.showVerifyError(errorText: "Could not resend code. Please try again.", type: "error")
            } else {
                self.showVerifyError(errorText: "Code sent! Check your email inbox.", type: "success")
            }
        }
    }

    // MARK: - Error display

    @objc func showVerifyError(errorText: String, type: String?) {
        if type == "success" {
            let message = MDCSnackbarMessage()
            message.text = errorText
            MDCSnackbarManager.show(message)
            return
        }

        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.verifyErrorLabel.text = errorText
            self.verifyErrorLabel.alpha = 1.0
        }, completion: nil)
    }

    @IBAction func hideVerifyError() {
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.verifyErrorLabel.text = ""
            self.verifyErrorLabel.alpha = 0.0
        }, completion: nil)
    }
}
