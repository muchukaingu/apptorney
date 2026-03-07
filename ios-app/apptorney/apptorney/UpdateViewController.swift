//
//  UpdateViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/21/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class UpdateViewController: UIViewController {

    @IBOutlet weak var updateBtn:UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
         self.updateBtn.layer.cornerRadius = self.updateBtn.frame.height/6

        // Do any additional setup after loading the view.
    }
    
    
    @IBAction func updateApp(sender: AnyObject) {
        UIApplication.shared.open(URL(string: "https://itunes.apple.com/us/app/apptorney/id1293993472?ls=1&mt=8")!, options: [:], completionHandler: nil)
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
