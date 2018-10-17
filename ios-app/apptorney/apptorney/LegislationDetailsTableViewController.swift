//
//  LegislationDetailsTableView.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/23/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class LegislationDetailsTableViewController: UITableViewController {
    
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
       
       
    }
    
    let debouncer = Debouncer(interval:0.5)
    

    //@IBOutlet weak var tableView: UITableView!
    let searchController = UISearchController(searchResultsController: nil)
    var searchResultsController = UITableViewController()
    var legislationInstance:Legislation!
    var searchText:String = ""
    var preliminaryCaseData:Legislation!
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    var height:CGFloat = 0
    var heightDiscount:CGFloat = 0
   
    
   
    @IBOutlet weak var bookmarkButton: UIBarButtonItem!
    var isBookmark:Bool?
    var searched = false
    
    var loaded = false
    @IBOutlet weak var judgement: UITextView!
    
    var sections = [Section(name:"", isCollapsed: false, height:0.0, isCollapsible: false, content:[FlatLegislationPart](), highlighted: false )]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.center.y = self.view.center.y - 100.0
        activityIndicator.startAnimating()
        self.populateLegislation()
        self.configureUIControls()
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        self.searchController.searchBar.delegate = self
        
        
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.center.y = self.view.center.y - 100.0
        activityIndicator.startAnimating()
        toggleLoadingMode()
        
    }
    
    func toggleLoadingMode(){
         self.tabBarController?.tabBar.isHidden = true
        self.navigationController?.isNavigationBarHidden = true
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
            //self.searchController.searchBar.becomeFirstResponder()
            self.searchController.searchBar.placeholder = "Search within this legislation"
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
            print("Text field: \(textField?.text ?? "")")
            Feedback.sendFeedback(feedback: textField?.text ?? "", scope: self.legislationInstance.id, resourceType: "legislation", completionHandler: { (result, error) in
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
    
    @objc func didTapSearchButton(sender: AnyObject){
       
    }
    
    func checkBookmark(){
        let userDefaults = UserDefaults.standard
        if let bookmarks = userDefaults.stringArray(forKey: "bookmarks"){
            
            for bookmark in bookmarks {
                
                if bookmark == legislationInstance.id {
                    self.isBookmark = true
                    self.bookmarkButton.image = (UIImage(named: "bookmark-red"))
                    self.bookmarkButton.tintColor = UIColor.red
                    //self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-red"), for: .normal, barMetrics: UIBarMetrics.default)
                } else {
                    self.isBookmark = false
                    self.bookmarkButton.image = (UIImage(named: "bookmark-white"))
                    self.bookmarkButton.tintColor = UIColor.black
                }
            }
        }
    }
    
    var myFlattenedArray = [FlatLegislationPart]()
    func flattenArray(nestedArray: [LegislationPart]) -> [FlatLegislationPart] {
        
        for element in nestedArray {
            if element.subParts!.count == 0 {
                print("adding...")
                myFlattenedArray.append(FlatLegislationPart(number: element.number, title: element.title, content: element.content, table: element.table, file: element.file))
            } else {
                print("recursion...")
                
                myFlattenedArray.append(FlatLegislationPart(number: element.number, title: element.title, content: element.content, table: element.table, file: element.file))
                let recursionResult = flattenArray(nestedArray: element.subParts!)
                /*for part in element.subParts! {
                    myFlattenedArray.append(FlatLegislationPart(number: part.number, title: part.title, content: part.content, table: part.table, file: part.file))
                }*/
                
                //            let nestedElements = element as! [Int]
                //            for num in nestedElements {
                //                myFlattenedArray.append(num)
                //            }
            }
        }
        return myFlattenedArray
    }
    
    
    private func populateLegislation(){
        let legislationId = legislationInstance._id
        Legislation.loadLegislation(legislationId: legislationId, completionHandler:{(legislation,error) in
            self.legislationInstance = legislation
            self.checkBookmark()
            let volume = self.legislationInstance.volumeNumber ?? ""
            let chapter = self.legislationInstance.chapterNumber ?? ""
            var volumeDetails = ""
            if volume.count == 0 && chapter.count == 0 {
                volumeDetails = ""
            }
            else {
                volumeDetails = "Volume " + volume + ", Chapter " + chapter
                let amends = self.legislationInstance.yearOfAmendment ?? 0
                if let assent = self.legislationInstance.dateOfAssent?.prefix(4) {
                    volumeDetails = volumeDetails + " of \(assent)"
                }
                if amends != 0 {
                    volumeDetails = volumeDetails + " (Amended in \(amends))"
                }
            
            }
            
            self.removeIndicator()
            let parts = self.legislationInstance.legislationParts?.count == 1 ? self.legislationInstance.legislationParts![0].subParts : self.legislationInstance.legislationParts
            for part in parts! {
                self.myFlattenedArray = [FlatLegislationPart]()
                self.myFlattenedArray.append(FlatLegislationPart(number: nil, title: nil, content: part.content, table: nil, file: nil))
                let flattenedContent = self.flattenArray(nestedArray: part.subParts!)
                //var attributedString = NSMutableAttributedString(string: part.flatContentNew ?? "")
                print("Title", part.title ?? "")
                //dump(flattenedContent)
                let result = NSMutableAttributedString().setHTMLFromString(text: part.flatContentNew ?? "", target: self.searchText, color:UIColor(hex: "f3a435"))
                let highlighted = result.1 > 0 ? true:false
                let partNumber = part.number ?? ""
                let partTitle = part.title?.uppercased() ?? ""
                self.sections.append(Section(name: partNumber + " " + partTitle, isCollapsed: true, height:0.0, isCollapsible: true, content:flattenedContent, highlighted: highlighted ))
            }
            
            
        
       
            self.loaded = true
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
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
                summarycell.firstLabel?.text = legislationInstance.legislationType ?? ""
//            //summarycell.secondLabel?.text = legislationInstance.legislationNumbers ?? legislationInstance.legislationNumber
//            summarycell.secondLabel?.text = "Year of Assent | \(legislationInstance.dateOfAssent!.prefix(4)) \n Year of Amendment | \(legislationInstance.yearOfAmendment!)"
            let volume = legislationInstance.volumeNumber ?? ""
            let chapter = legislationInstance.chapterNumber ?? ""
        
            if volume.count == 0 && chapter.count == 0 {
                summarycell.fourthLabel?.text = ""
            }
            else {
                var volumeDetails = "Volume " + volume + ", Chapter " + chapter
                let amends = legislationInstance.yearOfAmendment ?? 0
                if let assent = legislationInstance.dateOfAssent?.prefix(4) {
                    volumeDetails = volumeDetails + " of \(assent)"
                }
                if amends != 0 {
                    volumeDetails = volumeDetails + " (Amended in \(amends))"
                }
                summarycell.fourthLabel?.text = volumeDetails
            }
            summarycell.fifthLabel?.text = legislationInstance.enactment
            summarycell.sixthLabel?.text = legislationInstance.preamble
            summarycell.sixthLabel.sizeToFit()
            
            summarycell.thirdLabel?.text = legislationInstance.legislationName
            
            if searched {
                summarycell.sixthLabel.attributedText = NSMutableAttributedString().setHTMLFromString(text: legislationInstance.preamble ?? "", target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
                summarycell.sixthLabel.sizeToFit()
                
                //summarycell.thirdLabel?.attributedText = NSMutableAttributedString().setHTMLFromString(text: legislationInstance.legislationName ?? "", target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
            }
            
            
            
            
            if summarycell.thirdLabel.calculateMaxLines() == 1{
                heightDiscount = 55
            }
          
            if legislationInstance.preamble == nil{
                heightDiscount = 60
            }
            
            height = CGFloat(summarycell.thirdLabel.calculateMaxLines() * 0.8 + summarycell.sixthLabel.calculateMaxLines() * 1) * 60
            print(heightDiscount)
            
          
            return summarycell
            //let insets: UIEdgeInsets = cell.mainText.textContainerInset
            
            
        default:
            let cellIndetifier = "DetailCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
            //cell.mainText?.attributedText = sections[index].content
            let title = sections[index].content![indexPath.row].title == "" ? "" :  (sections[index].content![indexPath.row].number ?? "") + " " + (sections[index].content![indexPath.row].title ?? "")
            let content = sections[index].content![indexPath.row].number == "" ? sections[index].content![indexPath.row].content : (sections[index].content![indexPath.row].number ?? "") + " " + (sections[index].content![indexPath.row].content ?? "")
            cell.titleLabel?.text = title
            cell.mainText?.text = content
            
            if searched {
                cell.titleLabel.attributedText = NSMutableAttributedString().setHTMLFromString(text: title, target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
                cell.mainText.attributedText = NSMutableAttributedString().setHTMLFromString(text: content!, target: self.searchController.searchBar.text!, color:UIColor(hex: "f3a435")).0
            }
            //hack
            cell.mainText?.textContainerInset = sections[index].content![indexPath.row].content == "" ? UIEdgeInsets.init(top: -10, left: 0, bottom: 0, right: 0) : UIEdgeInsets.init(top: 6, left: 0, bottom: 8, right: 0)
//            cell.mainText?.contentInset = indexPath.row > 0 && sections[index].content![indexPath.row-1].content == "" ? UIEdgeInsetsMake(-20,0,0,0) : UIEdgeInsetsMake(0,0,0,0)
//            self.view.bringSubview(toFront: cell.mainText)
            cell.titleLabel.sizeToFit()
            cell.mainText.sizeToFit()
            return cell
        }
  
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
            return item.content!.count
        }
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        if !loaded{
            return 0
        }
    
        return sections.count
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
        if section == 0 {
            return 0
        }
        return 40.0
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
    
    /*
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.section == 0 {
            return UITableViewAutomaticDimension
        } else {
            return UITableViewAutomaticDimension
        }
    }
    
    override func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.section == 0 {
            return 45
        } else {
            return 45
        }
    }
 
 */
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
       
    }
    
   
    
    func removeIndicator(){
        configureUIControls()
        activityIndicator.stopAnimating()
        self.tabBarController?.tabBar.isHidden = false
    
        
    }
    
    
    @IBAction func bookmark(_ sender: Any) {
        if self.isBookmark == true {
            self.bookmarkButton.image = (UIImage(named: "bookmark-white"))
            self.bookmarkButton.tintColor = UIColor.black
            //self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-white"), for: .normal, barMetrics: UIBarMetrics.default)
            self.isBookmark = false
        } else {
            self.bookmarkButton.image = (UIImage(named: "bookmark-red"))
            self.bookmarkButton.tintColor = UIColor.red
            //self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-red"), for: .normal, barMetrics: UIBarMetrics.default)
            self.isBookmark = true
        }
        let bookmark = HomeItem (title: "", summary: "", type: "legislation", sourceId: legislationInstance.id!)
        HomeItem.addBookmarks(bookmark: bookmark, completionHandler:{(result,error) in
            let res = result as! Bool
            if res == true {
               
                
            } else {
                print("zoona")
                if self.isBookmark == true {
                    self.bookmarkButton.image = (UIImage(named: "bookmark-white"))
                    self.bookmarkButton.tintColor = UIColor.black
                    //self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-white"), for: .normal, barMetrics: UIBarMetrics.default)
                    self.isBookmark = false
                } else {
                    self.bookmarkButton.image = (UIImage(named: "bookmark-red"))
                    self.bookmarkButton.tintColor = UIColor.red
                    //self.bookmarkButton.setBackgroundImage(UIImage(named: "bookmark-red"), for: .normal, barMetrics: UIBarMetrics.default)
                    self.isBookmark = true
                }
            }
        })
    }
    
}

extension LegislationDetailsTableViewController: HeaderViewDelegate {
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


extension LegislationDetailsTableViewController: UISearchBarDelegate {
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

