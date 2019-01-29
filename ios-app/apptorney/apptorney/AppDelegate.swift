//
//  AppDelegate.swift
//  MR
//
//  Created by Muchu Kaingu on 3/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
       
        checkForUpdate()
        
        
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        checkForUpdateInBackground()
        checkForSubscriptionInBackground()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func checkForUpdate(){
        
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let sb = UIStoryboard(name: "Update", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Loading")
        self.window?.rootViewController = initialViewController
        self.window?.makeKeyAndVisible()
        
        
        Subscription.checkForUpdate(completionHandler:{(res,error) in
            print(res)
            if res == true {
                print("Update now")
                let sb = UIStoryboard(name: "Update", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "ForceUpdate")
                
            } else if res == false {
                
                //self.window = UIWindow(frame: UIScreen.main.bounds)
                let sb = UIStoryboard(name: "Main", bundle: nil)
                
                
                let userDefaults = UserDefaults.standard
                
                if userDefaults.bool(forKey: "onboardingComplete") {
                    
                    if userDefaults.bool(forKey: "loginComplete") {
                        //initialViewController = sb.instantiateViewController(withIdentifier: "Home")
                        self.checkSubscription()
                        
                    }
                    else if userDefaults.bool(forKey: "registrationComplete") {
                        initialViewController = sb.instantiateViewController(withIdentifier: "Login")
                    }
                    else {
                       
                        initialViewController = sb.instantiateViewController(withIdentifier: "Register")
                    }
                } else {
                    initialViewController = sb.instantiateViewController(withIdentifier: "Onboarding")
                }
                
            }
            self.window?.rootViewController = initialViewController
            self.window?.makeKeyAndVisible()
        })
    }
    
    func checkForUpdateInBackground(){
        Subscription.checkForUpdate(completionHandler:{(res,error) in
            print(res)
            if res == true {
                print("Update now")
                self.window = UIWindow(frame: UIScreen.main.bounds)
                let sb = UIStoryboard(name: "Update", bundle: nil)
                let initialViewController = sb.instantiateViewController(withIdentifier: "ForceUpdate")
                self.window?.rootViewController = initialViewController
                self.window?.makeKeyAndVisible()
                
            }
        })
        
    }
    
    
    func checkForSubscriptionInBackground(){
        print("Checking validity of subscription in background...")
        //self.window = UIWindow(frame: UIScreen.main.bounds)
        let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
        IAPHandler.shared.receiptValidation(completionHandler: {(validity) in
           
            if validity == false {
                print("Subscription is invalid")
                let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
                DispatchQueue.main.async {
                    self.window?.rootViewController = initialViewController
                    self.window?.makeKeyAndVisible()
                }
                
            }
            
            
        })
        
    }
    
    func checkSubscription(){
        print("Checking subscription validity...")
        //self.window = UIWindow(frame: UIScreen.main.bounds)
        let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
        IAPHandler.shared.receiptValidation(completionHandler: {(validity) in
            if validity == true {
                print("Subscription is valid")
                let sb = UIStoryboard(name: "Main", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "Home")
            } else {
                print("Subscription is invalid")
                let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
                
            }
            DispatchQueue.main.async {
                self.window?.rootViewController = initialViewController
                self.window?.makeKeyAndVisible()
            }
            
        })
    }


}

