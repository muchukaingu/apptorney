//
//  MenuTableViewController.swift
//  MR
//
//  Created by Muchu Kaingu on 4/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit


protocol MenuTableViewControllerDelegate {
    func MenuTableViewControllerStoreSelected(_ controller: MenuTableViewController)
    
    
    
}

class MenuTableViewController: UITableViewController {
    @objc var defaults: UserDefaults = UserDefaults.standard
    var delegate:MenuTableViewControllerDelegate?
    @objc var stores = [NSString]()
    override func viewDidLoad() {
        super.viewDidLoad()
        //self.loadStores()
        stores.removeAll(keepingCapacity: false)
        self.tableView.reloadData()
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        

        
        
        //let storeArray = defaults.objectForKey("Stores") as [Store]
        
        if let testArray : AnyObject? = defaults.object(forKey: "Stores") as AnyObject?? {
            stores = testArray! as! [NSString]
        }
        
        
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

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Potentially incomplete method implementation.
        // Return the number of sections.
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete method implementation.
        // Return the number of rows in the section.
        
        
            var rows: Int
            switch section {
            case 0:
                rows=stores.count
            case 1:
                rows=1
            
            default:
                rows=0
                
            }
            return rows
            
      

       
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! StoresTableViewCell
        
        // Configure the cell...
        
        switch (indexPath as NSIndexPath).section {
        case 0:
            let store = stores[(indexPath as NSIndexPath).row]
            cell.selectionStyle=UITableViewCellSelectionStyle.none
            cell.fieldLabel1?.text=store as String
            
            if let currStore = defaults.object(forKey: "CurrentStore") as? String {
                if currStore==store as String{
                    cell.connectionStatus.image=UIImage(named: "connStatus6")

                    
                }
                else{
                    cell.connectionStatus.image=UIImage(named: "connStatus0")
                }
            }
           

        case 1:
            
            cell.selectionStyle=UITableViewCellSelectionStyle.none
            cell.fieldLabel1?.text="Log Out"
            cell.connectionStatus.image=UIImage(named: "logout-2")
            cell.fieldLabel1?.isUserInteractionEnabled = true;
            let tapGesture:UITapGestureRecognizer = UITapGestureRecognizer(target: self.revealViewController(), action: "done:")
        
            cell.fieldLabel1.addGestureRecognizer(tapGesture)

        
            
        default:break
            
            //print("")
        }

        

        return cell
    }
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
       
        //var currStore: String? = ""
        var  headerCell:UITableViewCell = tableView.dequeueReusableCell(withIdentifier: "cell") as UITableViewCell!
        
        switch section {
        case 0:
            headerCell = tableView.dequeueReusableCell(withIdentifier: "header") as UITableViewCell!
            headerCell.textLabel?.text="Select a Store"
            /*
            if let currStore = defaults.objectForKey("CurrentStore") as? String {
                headerCell.detailTextLabel!.text = "Connected to: " + currStore
            }
            else {
                headerCell.detailTextLabel!.text = "Not Connected"
            }
            */

        case 1: break
            //print("")
            
        default: break
            //print("")

            
        }
       
        
        
        return headerCell
    }
    
    override func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        let  footerCell = tableView.dequeueReusableCell(withIdentifier: "footer") as UITableViewCell!
        //var currStore: String? = ""
        //footerCell.textLabel?.text="Log Out"
        
        return footerCell

    }
    
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        var height: CGFloat
        switch section {
        case 0:
            height = 60.0
        case 1:
            height = 0.0
        default:
            height = 0.0
        }
        
        return height
    }
    override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        var height: CGFloat
        switch section {
        case 0:
            height = 30.0
        case 1:
            height = 0.0
        default:
            height = 0.0
        }
        
        return height
    }

    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print("selected")
        
        if self.revealViewController() != nil {
            self.revealViewController().revealToggle(self)
            //cell.action = "revealToggle:"
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
            // Uncomment to change the width of menu
            //self.revealViewController().rearViewRevealWidth = 62
            let cell = tableView.cellForRow(at: indexPath) as! StoresTableViewCell
            if cell.fieldLabel1?.text != "Log Out" {
                defaults.set(cell.fieldLabel1?.text, forKey: "CurrentStore")
                self.tableView.reloadData()
            }
        
         
        }
//        self.tableView?.reloadRowsAtIndexPaths([indexPath], withRowAnimation: UITableViewRowAnimation.None)
//        self.tableView?.selectRowAtIndexPath(indexPath, animated: false, scrollPosition: .None)

    }
    
    override func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        print("Deselect Cell Function")
         //self.tableView.reloadData()
    }
    
    

    
   

}
