//
//  LegislationDetailsTableView.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/23/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit

class LegislationDetailsTableViewController: UITableViewController {
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    var legislationInstance:Legislation!
    var preliminaryCaseData:Legislation!
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var activityIndicator = UIActivityIndicatorView()
    var strLabel = UILabel()
    let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    
    var loaded = false
    @IBOutlet weak var judgement: UITextView!
    
    var sections = [
        Section(name: "",
                isCollapsed: false, height:0.0, isCollapsible: false, content:"")
    ]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        activityIndicator("Loading Legislation")
        self.populateLegislation()
        self.configureUIControls()
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        //let nib = UINib(nibName: "ExpandableHeaderView", bundle: nil)
        //self.tableView.register(nib, forHeaderFooterViewReuseIdentifier: "ExpandableHeaderView")
        self.tableView.register(HeaderView.nib, forHeaderFooterViewReuseIdentifier: HeaderView.identifier)
        
    }
    
    
    private func populateLegislation(){
        let legislationId = legislationInstance._id
        Legislation.loadLegislation(legislationId: legislationId, completionHandler:{(legislation,error) in
            self.legislationInstance = legislation
            self.removeIndicator()
            for part in self.legislationInstance.legislationParts!{
                self.sections.append(Section(name:part.title!.capitalized, isCollapsed: true, height:0.0, isCollapsible: true, content:part.flatContentNew))
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
            
            //let jurisdiction = legislationInstance.jurisdiction?["name"]?.capitalized ?? ""
            //let location = legislationInstance.location?["name"] ?? ""
            
            summarycell.thirdLabel?.text = legislationInstance.legislationName?.capitalized
            if summarycell.thirdLabel.text!.count < 28{
                heightDiscount = 30
            }
            
            //summarycell.fourthLabel?.text = court + " | " + jurisdiction + " Jurisdiction | " + location
            //summarycell.fifthLabel?.text = legislationInstance.coram ?? ""
            let border:UIView = UIView(frame: CGRect(x: 20,y: 185 - heightDiscount,width: self.tableView.bounds.width-40, height: 1))
            border.backgroundColor = UIColor(red: 2.0/255, green: 160.0/255, blue: 243.0/255, alpha: 1.0)
            summarycell.addSubview(border)
            
            
            
            
            //summarycell.fourthLabel?.text = location
            //cell.fifthLabel?.text = preliminaryCaseData.area!.uppercased() + " | " + preliminaryCaseData.caseNumber!
            return summarycell
            //let insets: UIEdgeInsets = cell.mainText.textContainerInset

        default:
            let cellIndetifier = "DetailCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
            cell.mainText?.text = sections[index].content
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
            return 1
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
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.section == 0 {
            return UITableViewAutomaticDimension + 190 - heightDiscount
        } else {
            return UITableViewAutomaticDimension
        }
    }
    
    override func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.section == 0 {
            return UITableViewAutomaticDimension + 190 - heightDiscount
        } else {
            return UITableViewAutomaticDimension
        }
    }
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
       
    }
    
    func activityIndicator(_ title: String) {
        
        strLabel.removeFromSuperview()
        activityIndicator.removeFromSuperview()
        effectView.removeFromSuperview()
        
        strLabel = UILabel(frame: CGRect(x: 50, y: 0, width: 200, height: 46))
        strLabel.text = title
        strLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.medium)
        strLabel.textColor = UIColor(white: 0.9, alpha: 0.7)
        
        effectView.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - 40 - strLabel.frame.height/2 , width: 200, height: 46)
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
    
}

extension LegislationDetailsTableViewController: HeaderViewDelegate {
    func toggleSection(header: HeaderView, section: Int) {
       
        
        
        let item = sections[section]
       
        if item.isCollapsible! {
            
            // Toggle collapse
            let collapsed = !item.isCollapsed
            sections[section].isCollapsed = collapsed
            
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


