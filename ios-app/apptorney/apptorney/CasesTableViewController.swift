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
    let debouncer = Debouncer(interval:2.0)
    var cases = [Case]()
    var messageLabel:UILabel = UILabel(frame: CGRect(x: 0,y: 0, width: 200, height: 100)) as UILabel
    
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var activityIndicator = UIActivityIndicatorView()
    var strLabel = UILabel()
    var msgLabel = UILabel()
    let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    var errorImage = UIImageView()
   
    
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
            
            
            //search black screen fix
            self.definesPresentationContext = true
            self.searchController.searchResultsUpdater = self
            self.searchController.dimsBackgroundDuringPresentation = false
            self.searchController.definesPresentationContext = true
            
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
        cell.mainLabel.setHTMLFromString(text: caseInstance.name?.capitalized ?? "")
        cell.subTitleLabel.setHTMLFromString(text: caseInstance.highlight ?? "")
        cell.smallSubTitleLeft.text = caseInstance.areaOfLaw?.capitalized
        cell.smallSubTitleLeft.sizeToFit()
        cell.smallSubTitleRight.text = caseInstance.caseNumber
        cell.subTitleLabel.sizeToFit()
        
        
        
        cell.accessoryType = UITableViewCellAccessoryType.none
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 160.0
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
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showCaseDetails" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                CaseDetailsTableViewController
                destinationController.caseInstance = self.cases[(indexPath as NSIndexPath).row]
            }
        }
    }
    
    func activityIndicator(_ title: String) {
        
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
        
        strLabel = UILabel(frame: CGRect(x: 48, y: 0, width: 150, height: 46))
        strLabel.text = title
        strLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.medium)
        strLabel.textColor = UIColor(white: 1.0, alpha: 0.9)
        
        effectView.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - 40 - strLabel.frame.height/2 , width: 150, height: 46)
        effectView.layer.cornerRadius = 10
        effectView.layer.masksToBounds = true
        
        activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        activityIndicator.frame = CGRect(x: 5, y: 0, width: 46, height: 46)
        activityIndicator.startAnimating()
        
        effectView.contentView.addSubview(activityIndicator)
        effectView.contentView.addSubview(strLabel)
        view.addSubview(effectView)
        
        
    }
    
    func removeIndicator(){
        UIScreen.main.brightness = CGFloat(1.0)
        
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
    }

}



extension CasesTableViewController: UISearchResultsUpdating {
    
    func updateSearchResults(for searchController: UISearchController) {
        
        if self.searchController.searchBar.text == "" {
            
        }
        else {
            self.msgLabel.removeFromSuperview()
            self.errorImage.removeFromSuperview()
            self.cases = []
            self.tableView.reloadData()
            activityIndicator("Searching...")
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
                        self.msgLabel = UILabel(frame:CGRect(x: self.view.frame.midX -  134, y: self.view.frame.midY - 40 , width: 300, height: 46))
                        self.msgLabel.text = "No results for \u{22}\(searchTerm! as String)\u{22}"
                        self.msgLabel.sizeToFit()
                        self.msgLabel.frame = CGRect(x: self.view.frame.midX -  self.msgLabel.frame.width/2, y: self.view.frame.midY - 40 , width: 300, height: 46)
                        self.view.addSubview(self.msgLabel)
                        self.msgLabel.font = UIFont.boldSystemFont(ofSize: 17.0)
                        
                        self.errorImage = UIImageView(frame:CGRect(x: self.view.frame.midX -  48, y: self.view.frame.midY - 149.4 , width: 100, height: 109.4))
                        self.errorImage.image = UIImage(named: "case-law")
                        self.view.addSubview(self.errorImage)
                    }
                    else {
                        //self.messageLabel.isHidden = true
                        self.messageLabel.text = ""
                        self.msgLabel.removeFromSuperview()
                        self.errorImage.removeFromSuperview()
                    }
                    self.removeIndicator()
                    self.tableView.reloadData()
                    
                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
                })
            }
            
            debouncer.call()
        }
        
        
        
    }
    
    
}
