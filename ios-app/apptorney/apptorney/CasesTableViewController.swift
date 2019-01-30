//
//  CasesTableViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/15/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit
import Alamofire

class CasesTableViewController: UITableViewController {
    
    var searchController: UISearchController!
    var searchResultsController = UITableViewController()
    let debouncer = Debouncer(interval:0.5)
    var cases = [Case]()
    var messageLabel:UILabel = UILabel(frame: CGRect(x: 0,y: 0, width: 200, height: 100)) as UILabel
    var resourceType = ""
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var activityIndicator = UIActivityIndicatorView()
    var strLabel = UILabel()
    var msgLabel = UILabel()
    let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    var errorImage = UIImageView()
    var areas = [AreaOfLaw]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavBar()
        configureUIControls()
        tableView.rowHeight = 80
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.searchController.searchBar.delegate = self
        loadAreasOfLaw()

    }
    
    func loadAreasOfLaw(){
        /*
        AreaOfLaw.search(completionHandler:{(areas,error) in
            self.areas = areas
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
         */
        self.areas = [
            AreaOfLaw(name: "Thematic Domains", _id: "themes", description: "Show cases categorized by their Areas of Law e.g. Employment, Criminal, Torts", id: "domains"),
            AreaOfLaw(name: "Chronological", _id: "years", description: "Show cases according to the year in which judgement was passed", id: "schedule")
        ]
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
    
    
    var items = [HomeItem]()
    var selectedTitle = ""
    var area: String?
    func loadCasesByArea(area: AreaOfLaw!){
        self.selectedTitle =  area.name!
        self.area = area.id!
        self.performSegue(withIdentifier: "casesByArea", sender: self)
        
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
        return self.cases.count == 0 ? self.areas.count : self.cases.count
    }
    
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if cases.count == 0 {
            let cellIndetifier = "SummaryCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! SummaryTableViewCell
            tableView.separatorStyle = .none
            tableView.estimatedRowHeight = 180
            tableView.rowHeight = UITableViewAutomaticDimension
           
            let area = areas[(indexPath as NSIndexPath).row]
            cell.name.text = area.name
            cell.summary?.text = area.description
            cell.icon.image = UIImage(named: area.id!)
            return cell
        }
        else {
            let cellIndetifier = "Cell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CustomTableViewCell
            let caseInstance = cases[(indexPath as NSIndexPath).row]
            tableView.estimatedRowHeight = 80
            tableView.rowHeight = UITableViewAutomaticDimension
            //tableView.rowHeight = 180
            tableView.separatorStyle = .none
            
            // Configure the cell...
            cell.mainLabel.setHTMLFromString(text: caseInstance.name ?? "")
            cell.subTitleLabel.setHTMLFromString(text: caseInstance.highlight ?? caseInstance.summaryOfRuling ?? "")
            cell.smallSubTitleLeft.text = caseInstance.areaOfLaw?.name?.uppercased()
            cell.smallSubTitleLeft.sizeToFit()
            let year = caseInstance.citation?.year ?? 0
            let code = caseInstance.citation?.code ?? ""
            let page = caseInstance.citation?.pageNumber ?? 0
            let citationDetails = (caseInstance.caseNumber == "") ? "\(year)/ \(code)/ \(page)" : caseInstance.caseNumber
            cell.smallSubTitleRight.text =  citationDetails?.uppercased()
            cell.subTitleLabel.sizeToFit()
            cell.smallSubTitleLeft.layer.masksToBounds = true
            cell.smallSubTitleLeft.layer.cornerRadius = 4
            cell.smallSubTitleRight.layer.masksToBounds = true
            cell.smallSubTitleRight.layer.cornerRadius = 4
            
            cell.accessoryType = UITableViewCellAccessoryType.none
            
            return cell
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showCaseDetails" {
            self.searchController.searchBar.resignFirstResponder()
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                CaseDetailsTableViewController
                destinationController.caseInstance = self.cases[(indexPath as NSIndexPath).row]
            }
        }
        
        else if segue.identifier == "showCaseSegmentation" {
            self.searchController.searchBar.resignFirstResponder()
            print("in segue, mofo")
            let destinationController = segue.destination as!
            CaseCategoriesSegmentationVC
           
            destinationController.resourceType = self.resourceType
           
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
    
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if self.searchController.searchBar.text == "" {
            self.resourceType = areas[indexPath.row]._id!
            performSegue(withIdentifier: "showCaseSegmentation", sender: self)
        } else {
            performSegue(withIdentifier: "showCaseDetails", sender: self)
        }
        
    }

}



extension CasesTableViewController: UISearchResultsUpdating {
    
    func updateSearchResults(for searchController: UISearchController) {

        
        
        
    }
    
    
}

extension CasesTableViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String){
        let session = Alamofire.SessionManager.default.session
        session.getAllTasks { tasks in
            tasks.forEach { $0.cancel(); print("cancel-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx----------->") }
        }
        //print("searching again")
        if self.searchController.searchBar.text == "" {
            cancelSearch()
        }
        else {
            self.msgLabel.removeFromSuperview()
            self.errorImage.removeFromSuperview()
            
            
            debouncer.callback = {
                //self.activityIndicator("Searching...")
                UIApplication.shared.isNetworkActivityIndicatorVisible = true
                self.messageLabel.text = "Searching..."
                
                
                // Send the debounced network request here
                let searchTerm = self.searchController.searchBar.text
                
                Case.search(term: searchTerm, completionHandler:{(cases,error) in
                    print("callback")
                    self.cases = cases
                    print(self.cases)
                    if self.cases.count == 0 && self.searchController.searchBar.text != ""{
                        self.areas=[]
                        self.tableView.reloadData()
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
                        self.searchController.searchBar.resignFirstResponder()
                        
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
    
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        cancelSearch()
        
    }
    
    
    
    func cancelSearch(){
        //self.searchController.searchBar.resignFirstResponder()
        self.msgLabel.removeFromSuperview()
        self.errorImage.removeFromSuperview()
        let session = Alamofire.SessionManager.default.session
        session.getAllTasks { tasks in
            tasks.forEach { $0.cancel(); print("cancel-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx----------->") }
        }
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
        print("Cancel button tapped.x")
        self.cases = []
        loadAreasOfLaw()
        self.tableView.reloadData()
        tableView.separatorStyle = .none
        tableView.rowHeight = 85
        
    }
}
