//
//  CaseDetailsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/11/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//


import UIKit

class CaseDetailsViewController: UIViewController {
    
    var caseInstance:Case!
    
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    
    
    @IBOutlet weak var judgement: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.populateCase()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    private func populateCase(){
        self.title = caseInstance.name?.capitalized
        self.judgement.text = caseInstance.judgement
        //self.judgement.sizeToFit()
//        let sizeThatFits = judgement.sizeThatFits(judgement.frame.size)
//        judgementHeight.constant = self.view.frame.height * 0.9
//        print(judgementHeight.constant)
        
    }
    

}
