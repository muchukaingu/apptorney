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
        self.view.backgroundColor = UIColor.white
        self.signUpButton.layer.cornerRadius = self.signUpButton.frame.height / 6
        self.signUpButton.clipsToBounds = true

        self.txtEmailAddress.textContentType = .emailAddress
        self.txtEmailAddress.keyboardType = .emailAddress
        self.txtEmailAddress.autocapitalizationType = .none
        self.txtPhoneNumber.textContentType = .telephoneNumber

        // Hide password fields (no longer needed for OTP flow)
        self.txtPassword?.isHidden = true
        self.txtPasswordConfirmation?.isHidden = true

        for case let textField as SkyFloatingLabelTextField in self.containerView.subviews {
            if textField.textContentType != .emailAddress {
                textField.autocapitalizationType = .words
            }
            textField.titleFormatter = { $0 }
            textField.delegate = self
        }

        if self.view.bounds.size.height > 812.0 || self.view.bounds.size.height > 896.0 {
            moveToPoint = 34.0
        } else {
            moveToPoint = 0.0
        }

        registerForKeyboardNotifications()

        UIView.animate(withDuration: 0.2, delay: 1.4, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.txtFirstName.alpha = 1.0
            self.txtLastName.alpha = 1.0
            self.txtPhoneNumber.alpha = 1.0
            self.txtEmailAddress.alpha = 1.0
            self.signUpButton.alpha = 1.0
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.txtFirstName.becomeFirstResponder()
            }
        }, completion: nil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(keyboardWasShown), name: UIResponder.keyboardWillShowNotification, object: nil)
        defaultCenter.addObserver(self, selector: #selector(keyboardWillBeHidden), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    @objc func keyboardWasShown(aNotification: Notification) {
        let userInfo = aNotification.userInfo
        let keyboardScreenEndFrame = (userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)

        scrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
        scrollView.scrollIndicatorInsets = scrollView.contentInset

        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.5, options: [], animations: {
            self.signUpButton.transform = CGAffineTransform(translationX: 0, y: -keyboardViewEndFrame.height + self.moveToPoint)
        }, completion: nil)
    }

    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
    }

    @objc func showSignUpError(errorText: String) {
        let message = MDCSnackbarMessage()
        message.text = errorText
        MDCSnackbarManager.show(message)
    }

    @IBAction func hideSignUpError() {
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
        }, completion: nil)
    }

    func validateForm() -> Bool {
        formValid = true

        let email = (txtEmailAddress.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        let firstName = (txtFirstName.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        let lastName = (txtLastName.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)

        if email.isEmpty || !email.contains("@") {
            txtEmailAddress.errorMessage = "Enter a valid email address"
            formValid = false
        }
        if firstName.isEmpty {
            txtFirstName.errorMessage = "First Name is required"
            formValid = false
        }
        if lastName.isEmpty {
            txtLastName.errorMessage = "Last Name is required"
            formValid = false
        }

        return formValid
    }

    private func navigateToVerify(email: String) {
        let sb = UIStoryboard(name: "Main", bundle: nil)
        let verifyVC = sb.instantiateViewController(withIdentifier: "Verify") as! VerifyViewController
        verifyVC.email = email

        guard let window = UIApplication.shared.delegate?.window ?? nil else { return }
        UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: {
            window.rootViewController = verifyVC
        }, completion: nil)
    }

    // MARK: - Register (sends OTP to email)

    @IBAction func register() {
        if !validateForm() {
            return
        }

        self.hideSignUpError()
        self.signUpButton.setTitle("Signing up...", for: .normal)

        user.email = (txtEmailAddress.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        user.firstName = txtFirstName.text?.trimmingCharacters(in: .whitespacesAndNewlines)
        user.lastName = txtLastName.text?.trimmingCharacters(in: .whitespacesAndNewlines)
        user.phoneNumber = (txtPhoneNumber.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        user.organization = (txtOrganization.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines)

        user.register { success, error in
            if let error = error {
                var errorText = "Sign up failed. Please try again."
                if let afError = error as? AFError,
                   case .responseValidationFailed(let reason) = afError,
                   case .unacceptableStatusCode(let code) = reason {
                    if code == 409 {
                        errorText = "An account with this email already exists."
                    }
                }
                self.showSignUpError(errorText: errorText)
                self.signUpButton.setTitle("Sign Up", for: .normal)
            } else {
                let userDefaults = UserDefaults.standard
                userDefaults.set(true, forKey: "registrationComplete")
                userDefaults.synchronize()

                // Navigate to OTP verification
                self.navigateToVerify(email: self.user.email ?? "")
            }
        }
    }

    @IBAction func returnToSignIn() {
        let userDefaults = UserDefaults.standard
        if userDefaults.bool(forKey: "loggedOut") {
            self.dismiss(animated: true, completion: nil)
        } else {
            self.performSegue(withIdentifier: "signIn", sender: self)
        }
    }
}
