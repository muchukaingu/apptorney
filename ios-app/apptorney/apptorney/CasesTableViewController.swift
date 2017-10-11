//
//  CasesTableViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class CasesTableViewController: UITableViewController {
    
    var searchController: UISearchController!
    var searchResultsController = UITableViewController()
    let debouncer = Debouncer(interval:1.0)
    var cases = [Case]()
    var messageLabel:UILabel = UILabel(frame: CGRect(x: 0,y: 0, width: 200, height: 100)) as UILabel
   
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavBar()
        configureUIControls()
        self.tableView.delegate = self
        self.tableView.dataSource = self
        

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    func setupNavBar(){
        self.searchController = UISearchController(searchResultsController: nil)
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationItem.searchController = searchController
            navigationItem.hidesSearchBarWhenScrolling = false
            self.searchController.searchResultsUpdater = self
            self.searchController.dimsBackgroundDuringPresentation = false
            
        } else {
            // Fallback on earlier versions
            print("show normal bar")
        }
        
        //Setup SearchBar
        
        
        
        
        
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        self.tableView.contentInset = UIEdgeInsetsMake(0,0,0,0);
        
        // 1. UITableView Customisation
        //self.tableView.separatorStyle=UITableViewCellSeparatorStyle.none //remove separators before search
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        let margin:CGFloat = 38.0
        messageLabel.center.x = self.view.center.x + margin
        messageLabel.center.y = self.view.center.y - 50.0
        messageLabel.text="Loading..."
        messageLabel.textColor = UIColor.gray
        messageLabel.isHidden=true
        messageLabel.sizeToFit()
        self.view.addSubview(messageLabel)
        
        
        
    }


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return self.cases.count
    }
    
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIndetifier = "Cell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CustomTableViewCell
        let caseInstance = cases[(indexPath as NSIndexPath).row]
        
        
        // Configure the cell...
        cell.mainLabel.text = caseInstance.name?.capitalized
        cell.subTitleLabel.text = caseInstance.judgement
        cell.smallSubTitleLeft.text = caseInstance.area?.capitalized
        cell.smallSubTitleLeft.sizeToFit()
        cell.smallSubTitleRight.text = caseInstance.referenceNumber
        cell.subTitleLabel.sizeToFit()
        
        
        
        cell.accessoryType = UITableViewCellAccessoryType.none
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 110.0
    }
    

    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

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
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}



extension CasesTableViewController: UISearchResultsUpdating {
    
    func updateSearchResults(for searchController: UISearchController) {
        self.cases = []
        self.tableView.reloadData()
        self.messageLabel.text = ""
        if self.searchController.searchBar.text == "" {
            
        }
        else {
            UIApplication.shared.isNetworkActivityIndicatorVisible = true
            debouncer.callback = {
                self.messageLabel.text = "Searching..."
                
                
                // Send the debounced network request here
                let searchTerm = self.searchController.searchBar.text
                
                Case.search(term: searchTerm, completionHandler:{(cases,error) in
                    print("callback")
                    self.cases = cases
                    print(self.cases)
                    if self.cases.count == 0 {
                        self.messageLabel.text = "No match found"
                        self.messageLabel.sizeToFit()
                        self.messageLabel.isHidden = false
                    }
                    else {
                        //self.messageLabel.isHidden = true
                    }
                    self.tableView.reloadData()
                    self.messageLabel.text = ""
                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
                })
            }
            
            debouncer.call()
        }
        
        
        
    }
    
    
}
