//
//  LegislationsTableViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/17/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class LegislationsTableViewController: UITableViewController {
    
    @IBOutlet weak var spinner:UIActivityIndicatorView!
    
    var searchController: UISearchController!
    var searchResultsController = UITableViewController()
    let debouncer = Debouncer(interval:0.5)
    var legislations = [Legislation]()

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
        return self.legislations.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIndetifier = "Cell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CustomTableViewCell
        let legislation = legislations[(indexPath as NSIndexPath).row]
        
        
        // Configure the cell...
        cell.mainLabel.setHTMLFromString(text: legislation.legislationName?.capitalized ?? "")
        //cell.mainLabel.text = legislation.legislationName?.capitalized
        var excerpt = ""
        if legislation.searchHighlight == "..." {
            excerpt = legislation.preamble ?? ""
        }
        else {
            excerpt = legislation.searchHighlight!
        }
        cell.subTitleLabel.setHTMLFromString(text: excerpt)
        cell.subTitleLabel.sizeToFit()
        
        
        cell.accessoryType = UITableViewCellAccessoryType.none
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 95.0
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
    //override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showLegislationDetails" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                LegislationDetailsTableViewController
                destinationController.legislationInstance = self.legislations[(indexPath as NSIndexPath).row]
            }
        }
    }

}


extension LegislationsTableViewController: UISearchResultsUpdating {
    
    func updateSearchResults(for searchController: UISearchController) {
        self.legislations = []
        self.tableView.reloadData()
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        debouncer.callback = {
            // Send the debounced network request here
            let searchTerm = self.searchController.searchBar.text
            
            Legislation.search(term: searchTerm, completionHandler:{(legislations,error) in
                print("callback")
                print(legislations.count)
                print(error)
                self.legislations = legislations
             
                
                for legislation in self.legislations {
                    //print(legislation.legislationParts)
                }
                
                self.tableView.reloadData()
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
        }
        
        debouncer.call()
        
        
    }
    
    
}

//extension CasesTableViewController: UISearchResultsUpdating {
//    
//    func updateSearchResults(for searchController: UISearchController) {
//        self.cases = []
//        self.tableView.reloadData()
//        self.messageLabel.text = ""
//        if self.searchController.searchBar.text == "" {
//            
//        }
//        else {
//            UIApplication.shared.isNetworkActivityIndicatorVisible = true
//            debouncer.callback = {
//                self.messageLabel.text = "Searching..."
//                
//                
//                // Send the debounced network request here
//                let searchTerm = self.searchController.searchBar.text
//                
//                Case.search(term: searchTerm, completionHandler:{(cases,error) in
//                    print("callback")
//                    self.cases = cases
//                    print(self.cases)
//                    if self.cases.count == 0 {
//                        self.messageLabel.text = "No match found"
//                        self.messageLabel.sizeToFit()
//                        self.messageLabel.isHidden = false
//                    }
//                    else {
//                        //self.messageLabel.isHidden = true
//                        self.messageLabel.text = ""
//                    }
//                    self.tableView.reloadData()
//                    
//                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
//                })
//            }
//            
//            debouncer.call()
//        }
//        
//        
//        
//    }
//    
//    
//}
//
//
