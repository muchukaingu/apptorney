//
//  OnboardingViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/11/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit
import paper_onboarding

class OnboardingViewController: UIViewController, PaperOnboardingDataSource, PaperOnboardingDelegate {
    var currentIndex = 0
    
    @IBOutlet weak var onboardingView: OnboardingView!
    @IBOutlet weak var getStartedButton: UIButton!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var termsView: UIView!
    
    
   
    
    fileprivate let items = [
        OnboardingItemInfo(informationImage: UIImage(named: "login-icon")!,
                           title: "Welcome Aboard",
                           description: "Apptorney is an all-inclusive legal research tool that provides Legal Practitioners in Zambia with all the legal reference information they need.",
                           pageIcon: UIImage(),
                           color: UIColor.white,
                           titleColor: UIColor.black, descriptionColor: UIColor.black, titleFont: titleFont, descriptionFont: descriptionFont),
        
        OnboardingItemInfo(informationImage: UIImage(named: "case-law")!,
                           title: "Zambian Case Law",
                           description: "Apptorney provides a comprehensive library of Zambian Case Law. Find cases quickly by choosing Areas of Law or searching using any terms that you feel might be contained within the case",
                           pageIcon: UIImage(),
                           color: UIColor.white,
                           titleColor: UIColor.black, descriptionColor: UIColor.black, titleFont: titleFont, descriptionFont: descriptionFont),
        
        OnboardingItemInfo(informationImage: UIImage(named: "law-lib")!,
                           title: "Zambian Legislations",
                           description: "We have carefully digitised all relevant Legislations, Subsidiary Legislations and Applied Laws. Quickly find any piece of Zambian legislation by searching in our comprehensive library of Legislations.",
                           pageIcon: UIImage(),
                           color: UIColor.white,
                           titleColor: UIColor.black, descriptionColor: UIColor.black, titleFont: titleFont, descriptionFont: descriptionFont),
        OnboardingItemInfo(informationImage: UIImage(named: "share")!,
                           title: "Easily Share",
                           description: "Easily share content with colleagues and clients. Apptorney also enhances your productivity by allowing you to easily copy content to other applications like Microsoft Word.",
                           pageIcon: UIImage(),
                           color: UIColor.white,
                           titleColor: UIColor.black, descriptionColor: UIColor.black, titleFont: titleFont, descriptionFont: descriptionFont),
        
        OnboardingItemInfo(informationImage: UIImage(named: "heart")!,
                           title: "Make it Your Own",
                           description: "Make apptorney your own by bookmarking content, setting favorite Thematic Domains, and adding your personal details like a profile picture",
                           pageIcon: UIImage(),
                           color: UIColor.white,
                           titleColor: UIColor.black, descriptionColor: UIColor.black, titleFont: titleFont, descriptionFont: descriptionFont)
        
        ]
    override func viewDidLoad() {
        super.viewDidLoad()
        onboardingView.dataSource = self
        onboardingView.delegate = self
        self.getStartedButton.alpha = 0
        self.termsView.alpha = 0
        //self.getStartedButton.setTitle("Ge", for: .normal)
        self.getStartedButton.layer.cornerRadius = self.getStartedButton.frame.height/6
        navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.setValue(true, forKey: "hidesShadow")
        
        
    }
    
    
    func onboardingItemsCount() -> Int {
        return 5
    }
    
   func onboardingItem(at index: Int) -> OnboardingItemInfo {
    
        
       
        
        return items[index]
        
        
        
    }
    
    
    
    func onboardingConfigurationItem(_ item: OnboardingContentViewItem, index: Int) {
        
    }
    
    
    
    func onboardingWillTransitonToIndex(_ index: Int) {
        if index == 3 {
            
            if self.getStartedButton.alpha == 1 {
                UIView.animate(withDuration: 0.2, animations: {
                    self.getStartedButton.alpha = 0
                    self.nextButton.alpha = 1
                   
                })
            }
            
        }
        if currentIndex > index  {
             self.currentIndex = self.currentIndex - 1
        }
    }
    
    func onboardingDidTransitonToIndex(_ index: Int) {
        if index == 4 {
            UIView.animate(withDuration: 0.4, animations: {
                self.nextButton.alpha = 0
                self.getStartedButton.alpha = 1
                self.termsView.alpha = 1
            })
        }
    }
    
    
    
    @IBAction func gotStarted(_ sender: Any) {
        
        let userDefaults = UserDefaults.standard
        
        userDefaults.set(true, forKey: "onboardingComplete")
        
        userDefaults.synchronize()
        
    }
    
    
    @IBAction func Next(_ sender: Any) {
        if currentIndex == 0 {
            onboardingView.currentIndex(1, animated: true)
           
            
        }
        else {
            onboardingView.currentIndex(currentIndex+1, animated: true)
        }
        currentIndex = currentIndex+1
    }
    
    
    
    
    // MARK: - Navigation
    
    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showTerms" {
            
            let legislation:Legislation
            legislation = Legislation()
            legislation._id = "5badf52b4594190056063cae"
            print("in segue, mofo")
            let destinationController = segue.destination as!
            AgreementDetailsVC
            destinationController.legislationInstance = legislation
            destinationController.navigationController?.setNavigationBarHidden(false, animated: false)
            destinationController.navigationItem.rightBarButtonItems = []
            //destinationController.searchText = self.searchController.searchBar.text!
            if #available(iOS 11.0, *) {
                destinationController.navigationController?.navigationBar.prefersLargeTitles = true
                
                
                
                
            } else {
                // Fallback on earlier versions
                print("show normal bar")
            }
            
        }
            
        else if segue.identifier == "showPrivacy" {
            
            let legislation:Legislation
            legislation = Legislation()
            legislation._id = "5badec9d1a2fa200672d9abe"
            print("in segue, mofo")
            let destinationController = segue.destination as!
            AgreementDetailsVC
            destinationController.legislationInstance = legislation
            //destinationController.searchText = self.searchController.searchBar.text!
        }
    }
    
    
    
    
    
    
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}

extension OnboardingViewController {
    private static let titleFont = UIFont(name: "AvenirNext-Bold", size: 24)!
    private static let descriptionFont = UIFont(name: "AvenirNext-Regular", size: 17)!
    
//    private static let titleFont = UIFont(name: "Nunito-Bold", size: 36.0) ?? UIFont.boldSystemFont(ofSize: 36.0)
//    private static let descriptionFont = UIFont(name: "OpenSans-Regular", size: 14.0) ?? UIFont.systemFont(ofSize: 14.0)
}



