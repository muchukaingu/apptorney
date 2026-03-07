//
//  ErrorViewController.swift
//  MR
//
//  Created by Muchu Kaingu on 3/31/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit


protocol ErrorViewControllerDelegate {
    func ErrorViewControllerDidCancel(_ controller: ErrorViewController)
    
    
    
}
class ErrorViewController: UIViewController {
    @IBOutlet var errMessage: UILabel!
    @IBOutlet var errHeading: UILabel!
    @objc var textAlignment:NSTextAlignment = .center
    @objc var heading: String = "Oops!"
    @objc var error: String = ""
    var delegate: ErrorViewControllerDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        errMessage.textAlignment = textAlignment
        errHeading.textAlignment = textAlignment
        errHeading.text = heading
        errMessage.text = error
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    
    }
    
    
    @IBAction func cancel(_ sender: AnyObject ){
        self.delegate?.ErrorViewControllerDidCancel(self)
    }
    
    override var prefersStatusBarHidden : Bool {
        return true
    }


}
