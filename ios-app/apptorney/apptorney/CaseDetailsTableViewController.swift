//
//  CaseDetailsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/11/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//


import UIKit

class CaseDetailsTableViewController: UITableViewController {
    
    var caseInstance:Case!
    var preliminaryCaseData:Case!
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var activityIndicator = UIActivityIndicatorView()
    var strLabel = UILabel()
    let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    var isBookmark:Bool?
    
    @IBOutlet weak var bookmarkButton: UIBarButtonItem!
    
    var loaded = false
    @IBOutlet weak var judgement: UITextView!
    
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
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        activityIndicator("Loading Case")
        //self.tableView.isHidden = true
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        self.preliminaryCaseData = self.caseInstance
        self.populateCase()
        self.configureUIControls()
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
                summarycell.secondLabel?.text = caseInstance.caseNumber!
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
                        coram = coram + instance.name! + "\n"
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
            
            case 1:
                let cellIndetifier = "DetailCell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
                cell.mainText?.text = caseInstance.summaryOfRuling
                //let insets: UIEdgeInsets = cell.mainText.textContainerInset
                return cell
           
            case 2:
                let cellIndetifier = "DetailCell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
                cell.mainText?.text = caseInstance.summaryOfFacts
                print(cell.mainText.frame.size.height)
                return cell
            case 3:
                let cellIndetifier = "DetailCell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
                cell.mainText?.text = caseInstance.judgement
                print(cell.mainText.frame.size.height)
                return cell
            case 4:
                let cellIndetifier = "Cell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath)
                cell.textLabel?.text = caseInstance.casesReferedTo![index-4 + indexPath.row].name?.capitalized
                cell.accessoryType = UITableViewCellAccessoryType.disclosureIndicator
        
                return cell
            
            case 5:
                let cellIndetifier = "Cell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) //as! UITableViewCell
                cell.textLabel?.text = caseInstance.legislationsReferedTo![index-5 + indexPath.row].legislationName?.capitalized
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
            if section == 4 {
                return caseInstance.casesReferedTo?.count ?? 0
            }
            if section == 5 {
                return caseInstance.legislationsReferedTo?.count ?? 0
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
        if indexPath.section == 4 {
            performSegue(withIdentifier: "showCaseReference", sender: self)
            
        }
        else if indexPath.section == 5 {
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
                let caseInstance = self.caseInstance.casesReferedTo![(indexPath as NSIndexPath).row]
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
    
    func activityIndicator(_ title: String) {
        
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
        
        strLabel = UILabel(frame: CGRect(x: 50, y: 0, width: 160, height: 46))
        strLabel.text = title
        strLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.medium)
        strLabel.textColor = UIColor(white: 0.9, alpha: 0.7)
        
        effectView.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - 40 - strLabel.frame.height/2 , width: 160, height: 46)
        effectView.layer.cornerRadius = 15
        effectView.layer.masksToBounds = true
        
        activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        activityIndicator.frame = CGRect(x: 0, y: 0, width: 46, height: 46)
        activityIndicator.startAnimating()
        
        effectView.contentView.addSubview(activityIndicator)
        effectView.contentView.addSubview(strLabel)
        view.addSubview(effectView)
    }
    
    func removeIndicator(){
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
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
