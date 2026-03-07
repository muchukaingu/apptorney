//
//  LoginViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/8/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit
import Alamofire
import MaterialComponents.MaterialSnackbar
import SkyFloatingLabelTextField


class LoginViewController: UIViewController, SettingsTableViewControllerDelegate, UITableViewDelegate, ErrorViewControllerDelegate, SWRevealViewControllerDelegate, SWRevealViewControllerDismissDelegate {

    @IBOutlet weak var loginSpinner: UIActivityIndicatorView!
    @IBOutlet weak var forgotButton: UIButton!
    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var signUpLabel: UILabel!
    @IBOutlet weak var forgotLabel: UILabel!
    @IBOutlet weak var logoImageView: UIImageView!
    @IBOutlet weak var loginErrorLabel: UILabel!
    @IBOutlet weak var closeErrorButton: UIButton!
    @IBOutlet weak var lineView: UIView!
    @IBOutlet weak var logo: UILabel!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var spinner: UIActivityIndicatorView!
    @IBOutlet weak var txtUserName: SkyFloatingLabelTextField!
    @IBOutlet weak var txtPassword: UITextField!
    @objc var moveToPoint: CGFloat = 0.0
    @objc var tableYPoint: CGFloat = 0.0
    @objc var stores = [NSString]()
    @objc var numberOfLoginAttempts = 0
    @objc var nextAPI = ""
    var formValid: Bool = false


    override var prefersStatusBarHidden: Bool {
        return true
    }

    override func viewDidLoad() {

        super.viewDidLoad()

        UIApplication.shared.isStatusBarHidden = true
        self.loginButton.layer.cornerRadius = self.loginButton.frame.height / 6
        self.loginButton.clipsToBounds = true
        self.registerForKeyboardNotifications()

        // Configure for email-only OTP flow
        self.txtUserName.placeholder = "Email"
        self.txtUserName.title = "Email"
        self.txtUserName.textContentType = .emailAddress
        self.txtUserName.keyboardType = .emailAddress
        self.txtUserName.autocapitalizationType = .none
        self.txtUserName.autocorrectionType = .no
        txtUserName.titleFormatter = { $0 }

        // Hide password field and forgot password (no longer needed for OTP)
        self.txtPassword?.isHidden = true
        self.forgotButton?.isHidden = true
        self.forgotLabel?.isHidden = true

        self.loginButton.setTitle("Send Code", for: .normal)

        if self.view.bounds.size.height > 812.0 || self.view.bounds.size.height > 896.0 {
            moveToPoint = 34.0
        } else {
            moveToPoint = 0.0
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.txtUserName.becomeFirstResponder()
        }

        self.view.backgroundColor = UIColor.white
        UIView.animate(withDuration: 2.0, delay: 0.4, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
        }, completion: nil)

        UIView.animate(withDuration: 0.2, delay: 1.2, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
            self.loginButton.alpha = 1.0
            self.txtUserName.alpha = 1.0
        }, completion: nil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    func swRevealViewControllerDidSave(_ controller: SWRevealViewController) {
        let defaults: UserDefaults = UserDefaults.standard
        defaults.set(nil, forKey: "Stores")
        self.dismiss(animated: true, completion: nil)
    }

    @objc func SettingsTableViewControllerDidCancel(_ controller: SettingsTableViewController) {
        self.dismiss(animated: true, completion: nil)
    }

    @objc func SettingsTableViewControllerDidSave(_ controller: SettingsTableViewController) {
        if ((self.presentedViewController?.isBeingDismissed) != nil) {
            self.dismiss(animated: true, completion: nil)
        }
    }

    @objc func ErrorViewControllerDidCancel(_ controller: ErrorViewController) {
        self.dismiss(animated: true, completion: nil)
    }

    private func navigateToVerify(email: String) {
        let sb = UIStoryboard(name: "Main", bundle: nil)
        let verifyVC = sb.instantiateViewController(withIdentifier: "Verify") as! VerifyViewController
        verifyVC.email = email
        verifyVC.modalPresentationStyle = .fullScreen
        self.present(verifyVC, animated: true, completion: nil)
    }

    // MARK: - Login (send OTP)

    @IBAction func login() {
        self.hideLoginError()
        self.loginSpinner.startAnimating()
        self.loginButton.setTitle("Sending code...", for: .normal)

        let email = (txtUserName.text ?? "").trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        guard !email.isEmpty, email.contains("@") else {
            self.showLoginError(errorText: "Please enter a valid email address.")
            self.loginSpinner.stopAnimating()
            self.loginButton.setTitle("Send Code", for: .normal)
            return
        }

        let user = Appuser()
        user.login(email: email) { success, error in
            if let error = error {
                var errorText = "Sign in failed. Please try again."
                if let afError = error as? AFError,
                   case .responseValidationFailed(let reason) = afError,
                   case .unacceptableStatusCode(let code) = reason {
                    if code == 404 {
                        errorText = "No account found with this email."
                    } else if code == 429 {
                        errorText = "Please wait before requesting another code."
                    }
                }
                self.showLoginError(errorText: errorText)
                self.loginSpinner.stopAnimating()
                self.loginButton.setTitle("Send Code", for: .normal)
            } else {
                self.loginSpinner.stopAnimating()
                self.loginButton.setTitle("Send Code", for: .normal)
                self.navigateToVerify(email: email)
            }
        }
    }

    // MARK: - Keyboard handling

    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(LoginViewController.keyboardWasShown(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        defaultCenter.addObserver(self, selector: #selector(LoginViewController.keyboardWillBeHidden(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    @objc func keyboardWasShown(_ aNotification: Notification) {
        let userInfo = aNotification.userInfo
        let keyboardScreenEndFrame = (userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)

        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.5, options: [], animations: {
            self.loginButton.transform = CGAffineTransform(translationX: 0, y: -keyboardViewEndFrame.height + self.moveToPoint)
        }, completion: nil)
    }

    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
        if self.view.bounds.size.height == 568.0 {
            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
            }, completion: nil)
        }
    }

    // MARK: - Error display

    @objc func showLoginError(errorText: String) {
        let message = MDCSnackbarMessage()
        message.text = errorText
        MDCSnackbarManager.show(message)
    }

    @IBAction func hideLoginError() {
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIView.AnimationOptions.curveEaseIn, animations: {
        }, completion: nil)
    }

    @IBAction func returnToSignUp() {
        let userDefaults = UserDefaults.standard
        if userDefaults.bool(forKey: "loggedOut") {
            self.performSegue(withIdentifier: "signUp", sender: self)
        } else {
            self.dismiss(animated: true, completion: nil)
        }
    }
}
