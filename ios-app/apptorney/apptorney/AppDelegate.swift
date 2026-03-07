//
//  AppDelegate.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        checkForUpdate()
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        checkForUpdateInBackground()
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    func checkForUpdate() {
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let sb = UIStoryboard(name: "Update", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Loading")
        self.window?.rootViewController = initialViewController
        self.window?.makeKeyAndVisible()

        Subscription.checkForUpdate(completionHandler: { (res, error) in
            if res == true {
                let sb = UIStoryboard(name: "Update", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "ForceUpdate")
            } else if res == false {
                let sb = UIStoryboard(name: "Main", bundle: nil)
                let userDefaults = UserDefaults.standard

                if userDefaults.bool(forKey: "onboardingComplete") {
                    if userDefaults.bool(forKey: "loginComplete") && APIService.hasValidAuthSession() {
                        initialViewController = sb.instantiateViewController(withIdentifier: "Home")
                    } else if userDefaults.bool(forKey: "loginComplete") {
                        // Session expired — clear and show login
                        APIService.clearSession()
                        let sb = UIStoryboard(name: "Login", bundle: nil)
                        initialViewController = sb.instantiateViewController(withIdentifier: "Login")
                    } else if userDefaults.bool(forKey: "registrationComplete") {
                        let sb = UIStoryboard(name: "Login", bundle: nil)
                        initialViewController = sb.instantiateViewController(withIdentifier: "Login")
                    } else {
                        let sb = UIStoryboard(name: "Register", bundle: nil)
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

    func checkForUpdateInBackground() {
        Subscription.checkForUpdate(completionHandler: { (res, error) in
            if res == true {
                self.window = UIWindow(frame: UIScreen.main.bounds)
                let sb = UIStoryboard(name: "Update", bundle: nil)
                let initialViewController = sb.instantiateViewController(withIdentifier: "ForceUpdate")
                self.window?.rootViewController = initialViewController
                self.window?.makeKeyAndVisible()
            }
        })
    }

    func checkForSubscriptionInBackground() {
        let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
        IAPHandler.shared.receiptValidation(completionHandler: { (validity) in
            if validity == false {
                let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
                DispatchQueue.main.async {
                    self.window?.rootViewController = initialViewController
                    self.window?.makeKeyAndVisible()
                }
            }
        })
    }

    func checkSubscription() {
        let sb = UIStoryboard(name: "SubscriptionRenewal", bundle: nil)
        var initialViewController = sb.instantiateViewController(withIdentifier: "Subscription Renewal")
        IAPHandler.shared.receiptValidation(completionHandler: { (validity) in
            if validity == true {
                let sb = UIStoryboard(name: "Main", bundle: nil)
                initialViewController = sb.instantiateViewController(withIdentifier: "Home")
            } else {
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
