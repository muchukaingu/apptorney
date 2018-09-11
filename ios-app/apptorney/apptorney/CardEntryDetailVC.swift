//
//  CardEntryDetailVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/19/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField

class CardEntryDetailVC: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var txtExpirationDate: SkyFloatingLabelTextField!
 
    override func viewDidLoad() {
        super.viewDidLoad()
        txtExpirationDate.delegate = self
        let datePicker = MonthYearPickerView()
        
        datePicker.backgroundColor = UIColor.white
        txtExpirationDate.inputView = datePicker
        
        datePicker.onDateSelected = { (month: Int, year: Int) in
            let string = String(format: "%02d", month) + "/" + String(year).suffix(2).lowercased()
            self.txtExpirationDate.text = string
        }
        
        for case let textField as SkyFloatingLabelTextField in self.view.subviews {
            if textField.textContentType != .emailAddress {
                textField.autocapitalizationType = .words
            }
            textField.titleFormatter = { $0 }
            //textField.delegate = self as! UITextFieldDelegate
        }
        

        // Do any additional setup after loading the view.
    }
    
    @objc func datePickerChanged(sender: UIDatePicker) {
        let formatter = DateFormatter()
        //formatter.dateStyle = .full
        formatter.dateStyle = .short
        formatter.timeStyle = .none
        txtExpirationDate.text = formatter.string(from: sender.date)
        
        print("Try this at home")
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
