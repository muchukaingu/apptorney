//
//  PaymentOptionsVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/17/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class PaymentOptionsVC: UITableViewController {
    
   var paymentOptions = [HomeItem]()
    

    override func viewDidLoad() {
        super.viewDidLoad()
        paymentOptions = [
            HomeItem(title: "Corporate or Group Subscription", summary: "My subscription is paid for by my organization", type: "workers-2", sourceId: "xxx"),
            HomeItem(title: "Debit or Credit Card", summary: "Pay for my subscription using my debit or credit card", type: "credit-card-2", sourceId: "xxx"),
            HomeItem(title: "Bank Transfer or Deposit", summary: "I will deposit or transfer funds to your account", type: "cash-money", sourceId: "xxx"),
            HomeItem(title: "Mobile Money", summary: "Pay for my subscription using my Mobile Money", type: "smartphone", sourceId: "xxx"),
            HomeItem(title: "In App Purchase", summary: "Use my App Store credit to renew my subscription", type: "payment-method-4", sourceId: "xxx")
        ]
        setupNavBar()
        

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    func setupNavBar(){
        
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            
            
        } else {
            // Fallback on earlier versions
            print("show normal bar")
        }
        
        //Setup SearchBar
        
        
        
        
        
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return paymentOptions.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cellIndetifier = "SummaryCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! SummaryTableViewCell
        tableView.separatorStyle = .none
        tableView.estimatedRowHeight = 180
        tableView.rowHeight = UITableViewAutomaticDimension
        let option = paymentOptions[(indexPath as NSIndexPath).row]
        cell.name.text = option.title
        cell.summary?.text = option.summary
        cell.icon.image = UIImage(named: option.type!)
        return cell

      
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    
        //performSegue(withIdentifier: "showCardInput", sender: self)
        print("tapped")
        
    }
    

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
