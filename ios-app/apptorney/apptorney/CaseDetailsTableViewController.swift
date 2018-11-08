//
//  CaseDetailsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/11/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//


import UIKit

class CaseDetailsTableViewController: UITableViewController {
    
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()
    
    var caseInstance:Case!
    var preliminaryCaseData:Case!
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var isBookmark:Bool?
    let searchController = UISearchController(searchResultsController: nil)
    var searchResultsController = UITableViewController()
    @IBOutlet weak var bookmarkButton: UIBarButtonItem!
    let debouncer = Debouncer(interval:0.5)
    var searched = false
    var loaded = false
    @IBOutlet weak var judgement: UITextView!
    /*
    var sections = [
        Section(name: "",
                isCollapsed: false, height:0.0, isCollapsible: false, content:nil, highlighted: false),
        Section(name: "Summary of Holding".uppercased(),
                isCollapsed: false, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Summary of Facts".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Holding".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Cases Referenced".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Legislations Referenced".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false)
    ]
    */
    
    var sections = [
        Section(name: "",
                isCollapsed: false, height:0.0, isCollapsible: false, content:nil, highlighted: false),
        Section(name: "Cases Referenced".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Legislations Referenced".uppercased(),
                isCollapsed: true, height:0.0, isCollapsible: true, content:nil, highlighted: false),
        Section(name: "Holding".uppercased(),
                isCollapsed: false, height:0.0, isCollapsible: true, content:nil, highlighted: false)
        
    ]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.center.y = self.view.center.y - 100.0
        activityIndicator.startAnimating()
        
        //self.tableView.isHidden = true
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        self.preliminaryCaseData = self.caseInstance
        self.searchController.searchBar.delegate = self

        self.populateCase()
        self.configureUIControls()
        toggleLoadingMode()
    }
    
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        //        self.tableView.reloadData()
        print("viewDidAppear")
        //Loader.addLoaderTo(self.tableView)
    
        
        
    }
    
    func toggleLoadingMode(){
        self.tabBarController?.tabBar.isHidden = true
        self.navigationController?.isNavigationBarHidden = true
    }
    
    func checkBookmark(){
        let userDefaults = UserDefaults.standard
        if let bookmarks = userDefaults.stringArray(forKey: "bookmarks"){
           
            for bookmark in bookmarks {
                
                if bookmark == caseInstance.id {
                    self.isBookmark = true
                    self.bookmarkButton.image = UIImage()
                    self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-red-1"), for: .normal, barMetrics: UIBarMetrics.default)
                }
            }
        }
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        //let nib = UINib(nibName: "ExpandableHeaderView", bundle: nil)
        //self.tableView.register(nib, forHeaderFooterViewReuseIdentifier: "ExpandableHeaderView")
        self.tableView.register(HeaderView.nib, forHeaderFooterViewReuseIdentifier: HeaderView.identifier)
        
        
        let feedbackBtn: UIButton = UIButton(type: UIButtonType.custom)
        feedbackBtn.setImage(UIImage(named: "feedback-2"), for: [])
        feedbackBtn.addTarget(self, action: #selector(didTapFeedbackButton), for: UIControlEvents.touchUpInside)
        feedbackBtn.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        let feedbackButton = UIBarButtonItem(customView: feedbackBtn)
        
        navigationItem.rightBarButtonItems = [bookmarkButton, feedbackButton]
        
        
        
        //self.searchController = UISearchController(searchResultsController: nil)
        if #available(iOS 11.0, *) {
            //navigationController?.navigationBar.prefersLargeTitles = true
            navigationItem.searchController = self.searchController
            navigationItem.hidesSearchBarWhenScrolling = false
            //self.searchController.searchResultsUpdater = self
            //self.searchController.dimsBackgroundDuringPresentation = true
            
            //search black screen fix
            self.definesPresentationContext = true
            //self.searchController.searchResultsUpdater = self
            self.searchController.dimsBackgroundDuringPresentation = false
            self.searchController.definesPresentationContext = true
            self.searchController.searchBar.becomeFirstResponder()
            self.searchController.searchBar.placeholder = "Search within this case"
        } else {
            // Fallback on earlier versions
            print("show normal bar")
        }
        
        //Setup SearchBar

    }
    
    
    @objc func didTapFeedbackButton(sender: AnyObject){
        //1. Create the alert controller.
        let alert = UIAlertController(title: "Feedback", message: "Please provide your feedback below.", preferredStyle: .alert)
        
        //2. Add the text field. You can configure it however you need.
        alert.addTextField { (textField) in
            textField.placeholder = "Type your feedback here"
            
        }
        
        
        
        // 3. Grab the value from the text field, and print it when the user clicks OK.
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak alert] (_) in
            let textField = alert?.textFields![0] // Force unwrapping because we know it exists.
           
            Feedback.sendFeedback(feedback: textField?.text ?? "", scope: self.caseInstance.id, resourceType: "case", completionHandler: { (result, error) in
                print(result)
                let alert = UIAlertController(title: "Thank you", message: "We have sent you an email with more information.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak alert] (_) in
                    print("OK")
                }))
                self.present(alert, animated: true, completion: nil)
                
            })
            
        }))
        
        // 4. Present the alert.
        self.present(alert, animated: true, completion: nil)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    private func populateCase(){
        let caseId = caseInstance._id
        Case.loadCase(caseId: caseId, completionHandler:{(aCase,error) in
            
            print("aCase Court \(aCase.court?.name ?? "")")
            self.caseInstance = aCase
            print(self.caseInstance)
            self.removeIndicator()
            self.loaded = true
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            self.checkBookmark()
        })
        
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        //let cellIndetifier = "DetailCell"
        //let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
        let index = (indexPath as NSIndexPath).section
        switch (index){
            case 0:
                
                let cellIndetifier = "SummaryCell"
                let summarycell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsSummaryCell
                //cell.textLabel?.text = "Name of Case"
                summarycell.firstLabel?.text = preliminaryCaseData.areaOfLaw?.name?.capitalized
                summarycell.secondLabel?.text = caseInstance.caseNumber ?? ""
                let court = caseInstance.court?.name ?? ""
                //let courtDivision = caseInstance.courtDivision?["name"] ?? ""
                let jurisdiction = caseInstance.jurisdiction?.name ?? ""
                let location = caseInstance.location?.name ?? ""
              
                summarycell.thirdLabel?.text = caseInstance.name
                if summarycell.thirdLabel.text!.count < 28{
                    heightDiscount = 30
                }
                
                summarycell.fourthLabel?.text = court + " | " + jurisdiction + " Jurisdiction | " + location
                
                var coram = ""
                if let coramDetails = caseInstance.coram {
                    for instance in coramDetails {
                        coram = coram + (instance.name ?? "") + "\n"
                    }
                }
                summarycell.fifthLabel?.text = coram.capitalized
//                let border:UIView = UIView(frame: CGRect(x: 20,y: 125 - heightDiscount,width: self.tableView.bounds.width-50, height: 4))
//                border.backgroundColor = UIColor(red: 0.0/255, green: 0.0/255, blue: 0.0/255, alpha: 1.0)
//                summarycell.addSubview(border)
                
                
            
              
                
                //summarycell.fourthLabel?.text = location
                //cell.fifthLabel?.text = preliminaryCaseData.area!.uppercased() + " | " + preliminaryCaseData.caseNumber!
                return summarycell
                //let insets: UIEdgeInsets = cell.mainText.textContainerInset
            
            
            case 3:
                let cellIndetifier = "DetailCell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
                cell.mainText?.text = caseInstance.judgement
                if searched {
                    cell.mainText.attributedText = NSMutableAttributedString().setHTMLFromString(text: caseInstance.judgement ?? "", target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
                    cell.mainText.sizeToFit()
                }
                return cell
            case 1:
                let cellIndetifier = "Cell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath)
                cell.textLabel?.text = caseInstance.casesReferedTo!.count > 0 ? caseInstance.casesReferedTo![indexPath.row].name?.capitalized : "No Case References"
                if searched {
                    cell.textLabel?.attributedText = NSMutableAttributedString().setHTMLFromString(text: cell.textLabel?.text ?? "", target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
                    cell.textLabel?.sizeToFit()
                }
                cell.accessoryType = UITableViewCellAccessoryType.disclosureIndicator
        
                return cell
            
            case 2:
                let cellIndetifier = "Cell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) //as! UITableViewCell
                cell.textLabel?.text = caseInstance.legislationsReferedTo![indexPath.row].legislationName?.capitalized
                if searched {
                    cell.textLabel?.attributedText = NSMutableAttributedString().setHTMLFromString(text: cell.textLabel?.text ?? "", target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
                    cell.textLabel?.sizeToFit()
                }
                cell.accessoryType = UITableViewCellAccessoryType.disclosureIndicator
                return cell
            
            default:
                print("")
                return UITableViewCell()
        }
        //let size: CGSize = cell.mainText.sizeThatFits(CGSize(width: cell.mainText.frame.size.width, height: CGFloat.greatestFiniteMagnitude))
        //sections[0].height = size.height
        //return retu
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        let item = sections[section]
        guard item.isCollapsible! else {
            return 1
        }
        
        if item.isCollapsed {
            return 0
        } else {
            if section == 1 {
                return caseInstance.casesReferedTo?.count ?? 1
            }
            if section == 2 {
                return caseInstance.legislationsReferedTo?.count ?? 1
            }
            return 1
        }
        
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        if !loaded{
            return 0
        }
        return sections.count
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.section == 1 {
            performSegue(withIdentifier: "showCaseReference", sender: self)
            
        }
        else if indexPath.section == 2 {
            performSegue(withIdentifier: "showLegislationReference", sender: self)
            
        }
        
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showLegislationReference" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                LegislationDetailsTableViewController
                let legislation = self.caseInstance.legislationsReferedTo![(indexPath as NSIndexPath).row]
                legislation._id = legislation.id
                destinationController.legislationInstance = legislation
                let backItem = UIBarButtonItem()
                backItem.title = caseInstance.name?.capitalized
                navigationItem.backBarButtonItem = backItem // This will show in the next view controller being pushed
            }
        }
        
        if segue.identifier == "showCaseReference" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                print("in segue, mofo")
                let destinationController = segue.destination as!
                CaseDetailsTableViewController
                let caseInstance = self.caseInstance.casesReferedTo![(indexPath as NSIndexPath).row + 1]
                caseInstance._id = caseInstance.id
                destinationController.caseInstance = caseInstance
                let backItem = UIBarButtonItem()
                backItem.title = self.caseInstance.name?.capitalized
                navigationItem.backBarButtonItem = backItem // This will show in the next view controller being pushed
            }
        }
    }
   
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        /*
         let header = ExpandableHeaderView()
         header.customInit(title: sections[section].name, section: section, delegate: self)
         return header
         */
        if let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: HeaderView.identifier) as? HeaderView {
            let item = sections[section]
            
            headerView.section = item
            headerView.sectionID = section
            headerView.delegate = self
            return headerView
        }
        return UIView()
        
    }
    
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 30.0
    }
    /*
     override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        //let cell = tableView.dequeueReusableCell(withIdentifier: "DetailCell", for: indexPath) as! CaseDetailsTableViewCell
        
        
        if (sections[indexPath.section].isCollapsed) {
            print(sections[indexPath.row].height!)
            return sections[indexPath.row].height!
        } else {
            return 0
        }
    }
     */
 
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        print("Yebo Yes")
    }
    

    
    func removeIndicator(){
        self.activityIndicator.stopAnimating()
        self.tabBarController?.tabBar.isHidden = false
    }
    
    @IBAction func bookmark(_ sender: Any) {
        let bookmark = HomeItem (title: "", summary: "", type: "case", sourceId: caseInstance.id!)
        HomeItem.addBookmarks(bookmark: bookmark, completionHandler:{(result,error) in
            let res = result as! Bool
            if res == true {
                print("zoona")
                if self.isBookmark == true {
                    self.bookmarkButton.image = UIImage()
                    self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark"), for: .normal, barMetrics: UIBarMetrics.default)
                    self.isBookmark = false
                } else {
                    self.bookmarkButton.image = UIImage()
                    self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-red-1"), for: .normal, barMetrics: UIBarMetrics.default)
                    self.isBookmark = true
                }
               
            }
        })
    }
    
    
    
    

}

extension CaseDetailsTableViewController: HeaderViewDelegate {
    func toggleSection(header: HeaderView, section: Int) {
        print("header tapped")
       
        
        let item = sections[section]
        if item.isCollapsible! {
            
            // Toggle collapse
            let collapsed = !item.isCollapsed
            sections[section].isCollapsed = collapsed
            print(item.isCollapsed)
            header.setCollapsed(collapsed: collapsed)
            
            // Adjust the number of the rows inside the section
            tableView.beginUpdates()
            self.tableView?.reloadSections([section], with: .fade)
            tableView.endUpdates()
        }
        
        // collapse all expanded sections apart from tapped
        for i in 0..<sections.count  {
            if i != section && sections[section].isCollapsed==false {
                sections[i].isCollapsed = true
                tableView.beginUpdates()
                self.tableView?.reloadSections([i], with: .fade)
                tableView.endUpdates()
            }
        }


    }
}



extension CaseDetailsTableViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String){
        
        debouncer.callback = {
            print("searching...")
            self.searched = self.searchController.searchBar.text == "" ?  false : true
            for i in 0..<self.sections.count  {
                
                self.sections[i].isCollapsed = false
                self.tableView.beginUpdates()
                self.tableView?.reloadSections([i], with: .fade)
                self.tableView.endUpdates()
                
            }
            
        }
        debouncer.call()
        
        
        
        
    }
    
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        
    }
    
}
