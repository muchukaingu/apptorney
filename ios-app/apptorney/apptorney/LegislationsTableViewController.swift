//
//  LegislationsTableViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/17/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit
import Alamofire

class LegislationsTableViewController: UITableViewController {
    
    @IBOutlet weak var spinner:UIActivityIndicatorView!
    
    var searchController: UISearchController!
    var searchResultsController = UITableViewController()
    let debouncer = Debouncer(interval:0.5)
    var legislations = [Legislation]()
    
    var legislationTypes = [LegislationType]()
    
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
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        loadLegislationTypes()
        //tableView.rowHeight = UITableViewAutomaticDimension
        self.searchController.searchBar.delegate = self

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    func loadLegislationTypes(){
        LegislationType.search(completionHandler:{(types,error) in
            self.legislationTypes = types
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
    }
    
    func setupNavBar(){
        self.searchController = UISearchController(searchResultsController: nil)
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            navigationItem.searchController = searchController
            navigationItem.hidesSearchBarWhenScrolling = false
            self.searchController.searchResultsUpdater = self
            self.searchController.dimsBackgroundDuringPresentation = true
            
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
        return self.legislations.count == 0 ? self.legislationTypes.count : self.legislations.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
       
        //let cell: UITableViewCell
        if legislations.count == 0 {
            let cellIndetifier = "SummaryCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! SummaryTableViewCell
            tableView.separatorStyle = .none
            tableView.estimatedRowHeight = 80
            tableView.rowHeight = UITableViewAutomaticDimension
            let type = legislationTypes[(indexPath as NSIndexPath).row]
            cell.name.text = type.name
            cell.summary?.text = type.description
            return cell
        }
        else {
             let cellIndetifier = "Cell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CustomTableViewCell
            let legislation = legislations[(indexPath as NSIndexPath).row]
            
             //tableView.separatorStyle = .singleLine
             tableView.estimatedRowHeight = 80
             tableView.rowHeight = UITableViewAutomaticDimension
            tableView.separatorStyle = .none
            
            // Configure the cell...
            cell.mainLabel.setHTMLFromString(text: legislation.legislationName?.uppercased() ?? "")
            //cell.mainLabel.text = legislation.legislationName?.capitalized
            var excerpt = ""
            if legislation.highlight == "..." {
                excerpt = legislation.preamble ?? ""
            }
            else {
                excerpt = legislation.highlight!
            }
            cell.subTitleLabel.setHTMLFromString(text: excerpt)
            cell.subTitleLabel.sizeToFit()
            cell.smallSubTitleLeft.sizeToFit()
            cell.smallSubTitleLeft.layer.masksToBounds = true
            cell.smallSubTitleLeft.layer.cornerRadius = 4
            
            
            
            var volumeDetails = ""
            let amends = legislation.yearOfAmendment ?? 0
            
            if amends != 0 {
                volumeDetails = "Amended in \(amends)"
            }
            cell.smallSubTitleRight.text = volumeDetails
            
            
            cell.smallSubTitleLeft.text = legislation.legislationType?.uppercased() ?? ""
            cell.accessoryType = UITableViewCellAccessoryType.none
            return cell
        }
        
        //return cell
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
            self.searchController.searchBar.resignFirstResponder()
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                LegislationDetailsTableViewController
                destinationController.legislationInstance = self.legislations[(indexPath as NSIndexPath).row]
                destinationController.searchText = self.searchController.searchBar.text!
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
        //UIScreen.main.brightness = CGFloat(1.0)
       
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
    }

}


extension LegislationsTableViewController: UISearchResultsUpdating {
    
    func updateSearchResults(for searchController: UISearchController) {

 
        
        
    }
    
    
}

extension LegislationsTableViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String){
        let session = Alamofire.SessionManager.default.session
        session.getAllTasks { tasks in
            tasks.forEach { $0.cancel(); print("cancel-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx----------->") }
        }
        
        if self.searchController.searchBar.text == "" {
            self.legislations = []
            self.tableView.reloadData()
            tableView.separatorStyle = .none
            tableView.rowHeight = 85
        }
        else {
            self.msgLabel.removeFromSuperview()
            self.errorImage.removeFromSuperview()
           
            UIApplication.shared.isNetworkActivityIndicatorVisible = true
//            activityIndicator("Searching...")
            debouncer.callback = {
                // Send the debounced network request here
                let searchTerm = self.searchController.searchBar.text
                
                Legislation.search(term: searchTerm, completionHandler:{(legislations,error) in
                    self.legislations = legislations
                    if legislations.count == 0 && self.searchController.searchBar.text != "" {
                        self.msgLabel = UILabel(frame:CGRect(x: self.view.frame.midX -  134, y: self.view.frame.midY - 40 , width: 300, height: 46))
                        
                        self.msgLabel.text = "No results for \u{22}\(searchTerm! as String)\u{22}"
                        self.msgLabel.sizeToFit()
                        self.msgLabel.frame = CGRect(x: self.view.frame.midX -  self.msgLabel.frame.width/2, y: self.view.frame.midY - 40 , width: 300, height: 46)
                        self.view.addSubview(self.msgLabel)
                        self.msgLabel.font = UIFont.boldSystemFont(ofSize: 16.0)
                        
                        self.errorImage = UIImageView(frame:CGRect(x: self.view.frame.midX -  50, y: self.view.frame.midY - 140 , width: 100, height: 100))
                        self.errorImage.image = UIImage(named: "law-lib")
                        self.view.addSubview(self.errorImage)
                    }
                    else {
                        self.searchController.searchBar.resignFirstResponder()
                        self.msgLabel.removeFromSuperview()
                        self.errorImage.removeFromSuperview()
                    }
                    
                    print(legislations.count)
                    print(error.debugDescription)
                    
                    self.removeIndicator()
                    
                    self.tableView.reloadData()
                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
                })
            }
            
            debouncer.call()
        }
    }


}
