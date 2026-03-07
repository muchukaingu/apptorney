//
//  LoadingViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/26/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class LoadingViewController: UIViewController {
    
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.startAnimating()

        // Do any additional setup after loading the view.
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
