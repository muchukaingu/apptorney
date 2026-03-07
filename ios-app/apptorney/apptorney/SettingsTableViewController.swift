//
//  SettingsTableViewController.swift
//  MR
//
//  Created by Muchu Kaingu on 3/8/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit



protocol SettingsTableViewControllerDelegate {
    func SettingsTableViewControllerDidCancel(_ controller: SettingsTableViewController)
    func SettingsTableViewControllerDidSave(_ controller: SettingsTableViewController)
    
    
}

class SettingsTableViewController: UITableViewController {
    
    
    var delegate: SettingsTableViewControllerDelegate?
    @objc let defaults:UserDefaults = UserDefaults.standard
//    @IBOutlet var externalAPI: UITextField!
//    @IBOutlet var internalAPI: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView.tableFooterView = UIView(frame: CGRect.zero)
        
        

        
        
        
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        //
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) as! SimpleCell
        cell.selectionStyle=UITableViewCell.SelectionStyle.none
        cell.backgroundColor=UIColor.clear
        switch (indexPath as NSIndexPath).row {
        case 0:
            
            cell.valueText1.tintColor = UIColor.gray
            
            cell.fieldLabel1.text = "External API"
            
            if let externalAPI = defaults.object(forKey: "externalAPI") as! String? {
                cell.valueText1.text = externalAPI
                
            }

            
        case 1:

            cell.valueText1.tintColor = UIColor.gray
            
            cell.fieldLabel1.text = "Local API"
            
            if let internalAPI = defaults.object(forKey: "internalAPI") as! String? {
                cell.valueText1.text = internalAPI
                
            }
            
            
        default:
            print("")
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2
    }
    
    override  func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Potentially incomplete method implementation.
        // Return the number of sections.
        return 1
    }

    
//    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
//        let  cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as SimpleCell
//
//        // Configure the cell...
//        switch indexPath.row {
//            
//        case 0:
//            
//            cell.fieldLabel1.text = "API"
//            cell.valueText1.placeholder="Enter API URL"
//        case 1:
//            
//            cell.fieldLabel1.text = "API Key"
//            cell.valueText1.placeholder="Enter API Key "
//        case 2:
//            
//            cell.fieldLabel1.text = "Store Name"
//            cell.valueText1.placeholder="Enter Store Name"
//        
//        default:
//            println("")
//        }
//       
//        return cell
//    }
    
    
    @IBAction func SaveData() {
        
        let defaults: UserDefaults = UserDefaults.standard
        
        
        if let externalAPICell = tableView.cellForRow(at: tableView.indexPathsForVisibleRows![0] ) as? SimpleCell {
            
            defaults.set(externalAPICell.valueText1.text, forKey: "externalAPI")
        }
    
    
        if let internalAPICell = tableView.cellForRow(at: tableView.indexPathsForVisibleRows![1] ) as? SimpleCell {
    
            defaults.set(internalAPICell.valueText1.text, forKey: "internalAPI")
        }
    
 

    
        defaults.synchronize()
        self.delegate?.SettingsTableViewControllerDidSave(self)
    }
    
    @IBAction func cancel(_ sender: AnyObject ){
        self.delegate?.SettingsTableViewControllerDidCancel(self)
    }
    


  
}
