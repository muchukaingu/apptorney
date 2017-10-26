//
//  CaseDetailsViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 10/11/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//


import UIKit

class CaseDetailsTableViewController: UITableViewController, ExpandableHeaderViewDelegate {
    
    var caseInstance:Case!
    
    //@IBOutlet weak var judgementHeight: NSLayoutConstraint!
    
    
    @IBOutlet weak var judgement: UITextView!
    
    var sections = [
        Section(name: "Summary of Ruling",
                expanded: true, height:0.0),
        Section(name: "Summary of Facts",
                expanded: false, height:0.0),
        Section(name: "Judgment",
                expanded: false, height:0.0)
    ]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.populateCase()
        self.configureUIControls()
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        let nib = UINib(nibName: "ExpandableHeaderView", bundle: nil)
        self.tableView.register(nib, forHeaderFooterViewReuseIdentifier: "ExpandableHeaderView")

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    
    private func populateCase(){
        self.title = caseInstance.name?.capitalized
        
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIndetifier = "DetailCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CaseDetailsTableViewCell
        let index = (indexPath as NSIndexPath).section
        switch (index){
            case 0:
                cell.mainText?.text = caseInstance.summaryOfRuling
                //let insets: UIEdgeInsets = cell.mainText.textContainerInset
           
            case 1:
                cell.mainText?.text = caseInstance.summaryOfFacts
                print(cell.mainText.frame.size.height)
            case 2:
                cell.mainText?.text = caseInstance.judgement
                print(cell.mainText.frame.size.height)
            
            default:
                print("")
        }
        let size: CGSize = cell.mainText.sizeThatFits(CGSize(width: cell.mainText.frame.size.width, height: CGFloat.greatestFiniteMagnitude))
        sections[0].height = size.height
        return cell
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 1
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return sections.count
    }
    
    /*override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let  headerCell = tableView.dequeueReusableCell(withIdentifier: "HeaderCell")
        
        switch (section) {
        case 0:
            headerCell?.textLabel?.text = "Summary of Ruling";
            
        case 1:
            headerCell?.textLabel?.text = "Summary of Facts";
            
        case 2:
            headerCell?.textLabel?.text = "Judgment";
            

        default:
            headerCell?.textLabel?.text = "Other";
        }
        
        return headerCell
    }*/
    
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = ExpandableHeaderView()
        header.customInit(title: sections[section].name, section: section, delegate: self)
        return header
    }
    
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 45.0
    }
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        //let cell = tableView.dequeueReusableCell(withIdentifier: "DetailCell", for: indexPath) as! CaseDetailsTableViewCell
        
        
        if (sections[indexPath.section].expanded) {
            print(sections[indexPath.row].height!)
            return sections[indexPath.row].height!
        } else {
            return 0
        }
    }
    
    func toggleSection(header: ExpandableHeaderView, section: Int) {
        sections[section].expanded = !sections[section].expanded
        for i in 0..<sections.count  {
            if i != section && sections[section].expanded==true {
                sections[i].expanded = false
            }
        }
        tableView.beginUpdates()
        
        tableView.reloadRows(at: [IndexPath(row: 0, section: section)], with: .automatic)
        
        tableView.endUpdates()
    }

}
