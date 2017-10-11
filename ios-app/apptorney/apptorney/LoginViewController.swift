//
//  LoginViewController.swift
//  MR
//
//  Created by Muchu Kaingu on 3/8/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit
//import CryptoSwift

class LoginViewController: UIViewController, SettingsTableViewControllerDelegate, UITableViewDelegate, ErrorViewControllerDelegate, SWRevealViewControllerDelegate , SWRevealViewControllerDismissDelegate{
    

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
    @IBOutlet weak var txtUserName:UITextField!
    @IBOutlet weak var txtPassword:UITextField!
    @objc var moveToPoint: CGFloat = 0.0
    @objc var tableYPoint: CGFloat = 0.0
    @objc var stores = [NSString]()
    @objc var numberOfLoginAttempts = 0
    @objc var nextAPI = ""
    
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        UIApplication.shared.isStatusBarHidden = true
        
        self.registerForKeyboardNotifications()
        print(self.view.bounds.size.height)
        //check width of iphone
        
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

        
        
        //tableView.backgroundColor=UIColor.clear
        //tableView.separatorInset=UIEdgeInsets(top: 0.0, left: 0.0, bottom: 0.0, right: 0.0)
        
        self.view.backgroundColor=UIColor.white
        UIView.animate(withDuration: 2.0, delay: 0.4, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
            self.logo.transform = CGAffineTransform(translationX: 0, y: self.moveToPoint)
            
//            self.logoImageView.transform = CGAffineTransform(scaleX: 0.3, y: 0.3)
//            self.logoImageView.transform = CGAffineTransform(translationX: 0, y: self.moveToPoint)
            self.logoImageView.transform = CGAffineTransform.identity.translatedBy(x: 0, y: self.moveToPoint).scaledBy(x: 0.7, y: 0.7)
        }, completion:nil)
        
        
        UIView.animate(withDuration: 0.2, delay: 1.2, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.loginButton.alpha = 1.0
            self.txtUserName.alpha = 1.0
            self.txtPassword.alpha = 1.0
            self.signUpButton.alpha = 1.0
            self.forgotButton.alpha = 1.0
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
    
    func  swRevealViewControllerDidSave(_ controller: SWRevealViewController) {
        let defaults: UserDefaults = UserDefaults.standard
        defaults.set(nil, forKey: "Stores")
        self.dismiss(animated: true, completion: nil)

    }
    
    @objc func   SettingsTableViewControllerDidCancel(_ controller: SettingsTableViewController) {
        
        self.dismiss(animated: true, completion: nil)
        
    }

    
    @objc func  SettingsTableViewControllerDidSave(_ controller: SettingsTableViewController) {
        if ((self.presentedViewController?.isBeingDismissed) != nil) {
            self.dismiss(animated: true, completion:nil)
        }

    }
    
    @objc func  ErrorViewControllerDidCancel(_ controller: ErrorViewController) {
        
        self.dismiss(animated: true, completion: nil)
        
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        
        if segue.identifier == "Settings" {
                let navigationController = segue.destination as! UINavigationController
                let settingsViewController = navigationController.viewControllers[0] as! SettingsTableViewController
                settingsViewController.delegate = self
        
            
            
        }
        
        
        else if segue.identifier == "Login" {
            let vc: SWRevealViewController = segue.destination as! SWRevealViewController
            vc.firstdelegate = self

        }
        else if segue.identifier == "Error" {
            let navigationController = segue.destination as! UINavigationController
            let vc = navigationController.viewControllers[0] as! ErrorViewController
            vc.delegate = self
            vc.error = "Something went wrong. \r We were unable to connect you to the server. \r\r Please check your API Settings or Network Connection and try again."
            let bg = createBlurredSnapshop()
            vc.view.addSubview(bg)
            vc.view.sendSubview(toBack: bg)
            
            
        }

    }
    

    

    
    
    @IBAction func login() {
        self.hideLoginError()
        self.loginSpinner.startAnimating()
        self.loginButton.setTitle("Logging in...", for: .normal)
        let defaults: UserDefaults = UserDefaults.standard
        let user = Appuser()
        user.login(email: txtUserName.text, password: txtPassword.text, completionHandler:{(result,error) in
            self.performSegue(withIdentifier: "Login", sender: self)
            if error != nil {
                print(error!)
                self.showLoginError(errorText: "Log in failed. Please try again.")
                self.loginSpinner.stopAnimating()
                self.loginButton.setTitle("Log in", for: .normal)
                
                
            }
            else {
                print("Log in successful")
                self.performSegue(withIdentifier: "Login", sender: self)
                
            }
        })
       
    }
    
    @objc func createBlurredSnapshop() -> UIImageView {
        // 1
        let aView : UIImageView = UIImageView()
        aView.frame = self.view.frame
        // 2
        UIGraphicsBeginImageContextWithOptions(self.view.bounds.size, false, 0.0)
        
        // 3
        self.view.drawHierarchy(in: self.view.bounds, afterScreenUpdates: true)
        // 4
        let screenshot = UIGraphicsGetImageFromCurrentImageContext()
        
        UIGraphicsEndImageContext()
        
        let blurEffect = UIBlurEffect(style: UIBlurEffectStyle.dark)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame=self.view.bounds
        aView.image = screenshot
        self.view.addSubview(aView)
        aView.addSubview(blurEffectView)
        return aView
    }
    

    @objc func loadStores(){

        let defaults: UserDefaults = UserDefaults.standard
        defaults.set(nil, forKey: "Stores")
        stores.removeAll(keepingCapacity: false)
        let API = defaults.object(forKey: "API") as! String?
        let sessionID = defaults.object(forKey: "SessionID") as! String?
        //print(sessionID)
        print(API! + "/m-retailer/store_json.php?SessionID=" + sessionID!)
        DataManager.getDataFromURLWithSuccess(API! + "/m-retailer/store_json.php?SessionID=" + sessionID!) { (remoteData, error) -> Void in
            
            let json = JSON(data: remoteData!)
            
            if let appArray = json.array {
                //2
                //self.products = []
                
                //3
                var counter = 0
                let currentStore = defaults.object(forKey: "CurrentStore")
                //print(currentStore)
                for appDict in appArray {
                    
                    let StoreName: NSString? = appDict["StoreName"].stringValue as NSString?
                    if counter == 0 && API != "http://circuit.cloudapp.net:8083" && currentStore == nil{
                        defaults.set(StoreName!, forKey: "CurrentStore")
                        defaults.synchronize()

                    }
                    
                    self.stores.append(StoreName!)
                    self.stores.sort(by: { $0.description < $1.description })
                    counter+=1
                }
                
               DispatchQueue.main.async(execute: {
                
                    defaults.set(self.stores, forKey: "Stores")
                })
            }
            
        }
        
    }
    @objc func registerForKeyboardNotifications() {
        let defaultCenter = NotificationCenter.default
        defaultCenter.addObserver(self, selector: #selector(LoginViewController.keyboardWasShown(_:)), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        defaultCenter.addObserver(self, selector: #selector(LoginViewController.keyboardWillBeHidden(_:)), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    @objc func keyboardWasShown(_ aNotification: Notification) {
        
        if self.view.bounds.size.height <= 480.0 {
            tableYPoint = -45.0
            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
                //self.loginButton.transform = CGAffineTransform(translationX: 0, y: -85.0)
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: self.tableYPoint)
                self.logo.transform = CGAffineTransform(translationX: 0, y: -165.0)
                }, completion:nil)
        }
        else if self.view.bounds.size.height > 480.0 && self.view.bounds.size.height < 568.0 {
            tableYPoint = -20.0
            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
                //self.loginButton.transform = CGAffineTransform(translationX: 0, y: -55.0)
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: self.tableYPoint)
                }, completion:nil)
        }
        else if self.view.bounds.size.height == 568.0 {
            tableYPoint = -15.0
            UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.0, options: [], animations: {
                self.loginButton.transform = CGAffineTransform(translationX: 0, y: -215.0)
                self.txtUserName.transform = CGAffineTransform(translationX: 0, y: -45.0)
                self.txtPassword.transform = CGAffineTransform(translationX: 0, y: -45.0)
                self.lineView.transform = CGAffineTransform(translationX: 0, y: -45.0)
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: self.tableYPoint)
                }, completion:nil)
        }

        else if self.view.bounds.size.height == 667.0 {
            UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.0, options: [], animations: {
                self.loginButton.transform = CGAffineTransform(translationX: 0, y: -215.0)
                self.txtUserName.transform = CGAffineTransform(translationX: 0, y: -45.0)
                self.txtPassword.transform = CGAffineTransform(translationX: 0, y: -45.0)
                self.lineView.transform = CGAffineTransform(translationX: 0, y: -45.0)
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: self.tableYPoint)
            }, completion:nil)
        }
        else if self.view.bounds.size.height == 736.0 {
           
            UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 1.0, options: [], animations: {
                self.loginButton.transform = CGAffineTransform(translationX: 0, y: -226.0)
                self.loginSpinner.transform = CGAffineTransform(translationX: 0, y: -226.0)
                self.txtUserName.transform = CGAffineTransform(translationX: 0, y: -25.0)
                self.txtPassword.transform = CGAffineTransform(translationX: 0, y: -25.0)
//                self.signUpButton.titleLabel?.text = "Sign up"
//                self.forgotButton.titleLabel?.text = "Forgot?"
                self.signUpButton.setTitle("Sign up",for: .normal)
                self.forgotButton.setTitle("Forgot?",for: .normal)
                self.signUpButton.transform = CGAffineTransform(translationX: -38, y: -55.0)
                self.forgotButton.transform = CGAffineTransform(translationX: 38, y: -99.0)
               
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: self.tableYPoint)
            }, completion:nil)
        }
        

    }
    
    @objc func keyboardWillBeHidden(_ aNotification: Notification) {
        
        if self.view.bounds.size.height == 568.0 {
            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
                self.loginButton.transform = CGAffineTransform(translationX: 0, y: 0.0)
                //self.tableView.transform = CGAffineTransform(translationX: 0, y: 0.0)
                }, completion:nil)
        }

        
    }
    
    @objc func showLoginError(errorText: String){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.loginErrorLabel.text = errorText
            self.loginErrorLabel.alpha = 1.0
            self.closeErrorButton.alpha = 1.0
        }, completion:nil)
    }
    
    @IBAction func hideLoginError(){
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.6, initialSpringVelocity: 0.5, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.loginErrorLabel.text = ""
            self.loginErrorLabel.alpha = 0.0
            self.closeErrorButton.alpha = 0.0
            
        }, completion:nil)
    }


    

}
