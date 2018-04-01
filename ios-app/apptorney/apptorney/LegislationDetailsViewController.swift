//
//  LegislationDetailsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/23/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class LegislationDetailsViewController: UIViewController {
    
    var legislationInstance: Legislation!
    var searchText:String = ""
    var sections = [Section]()
    var loaded = false
    
    @IBOutlet weak var legislationTypeLabel: UILabel!
    @IBOutlet weak var legislationNumberLabel: UILabel!
    @IBOutlet weak var enactorLabel: UILabel!
    @IBOutlet weak var legislationNameLabel: UILabel!
    @IBOutlet weak var preambleLabel: UILabel!
    @IBOutlet weak var tableView: UITableView!
   
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //hideInterface()
        //configureUIControls()
        populateLegislation()
        
        // Do any additional setup after loading the view.
    }

    func configureUIControls () { //for cutomising controls on the UI
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        //let nib = UINib(nibName: "ExpandableHeaderView", bundle: nil)
        //self.tableView.register(nib, forHeaderFooterViewReuseIdentifier: "ExpandableHeaderView")
        self.tableView.register(HeaderView.nib, forHeaderFooterViewReuseIdentifier: HeaderView.identifier)
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    private func hideInterface(){
//        self.legislationNumberLabel.alpha = 0
//        self.legislationNameLabel.alpha = 0
//        self.preambleLabel.alpha = 0
//        self.enactorLabel.alpha = 0
//        self.areaLabel.alpha = 0
//        self.tableView.alpha = 0
    }
    
    private func populateLegislation(){
        tableView.delegate = self
        tableView.dataSource = self
        let legislationId = legislationInstance._id
        Legislation.loadLegislation(legislationId: legislationId, completionHandler:{(legislation,error) in
            self.legislationInstance = legislation
            self.preambleLabel.setHTMLFromStringForLightText(text: self.legislationInstance.preamble ?? "")
            self.legislationNameLabel.text = self.legislationInstance.legislationName
            self.legislationTypeLabel.text = self.legislationInstance.legislationType
            self.enactorLabel.text = self.legislationInstance.enactment
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
            self.legislationNumberLabel.text = volumeDetails
            self.legislationNameLabel.sizeToFit()
            self.preambleLabel.sizeToFit()
            //self.removeIndicator()
            for part in self.legislationInstance.legislationParts!{
                //var attributedString = NSMutableAttributedString(string: part.flatContentNew ?? "")
                let result = NSMutableAttributedString().setHTMLFromString(text: part.flatContentNew ?? "", target: self.searchText, color:UIColor(hex: "f3a435"))
                let highlighted = result.1 > 0 ? true:false
                self.sections.append(Section(name:part.title?.uppercased() ?? "", isCollapsed: true, height:0.0, isCollapsible: true, content:result.0, highlighted: highlighted ))
            }

            self.loaded = true
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
    }
}

extension LegislationDetailsViewController: UITableViewDelegate {
    
}


extension LegislationDetailsViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        print("cell for row")
        let index = (indexPath as NSIndexPath).section
        let cellIndetifier = "DetailCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
        cell.mainText?.attributedText = sections[index].content
        return cell
        
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
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
    
    func numberOfSections(in tableView: UITableView) -> Int {
        if !loaded{
            return 0
        }
        
        return sections.count
    }
    
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
   
        if let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: HeaderView.identifier) as? HeaderView {
            let item = sections[section]
            
            headerView.section = item
            headerView.sectionID = section
            headerView.delegate = self
            return headerView
        }
        return UIView()
        
    }
    
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 40.0
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableViewAutomaticDimension
    }
    
    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableViewAutomaticDimension
    }
    
    
    
    
    
}



extension LegislationDetailsViewController: HeaderViewDelegate {
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

