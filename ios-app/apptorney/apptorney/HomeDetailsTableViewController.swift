//
//  HomeDetailsTableViewController.swift
//  apptorney
//
//  Created by Muchu Kaingu on 4/1/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class HomeDetailsTableViewController: UITableViewController {
    
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()
    
    var items: [HomeItem]?
    var viewTitle: String?
    var viewTitleColor: UIColor?
    var selectedId:String?
    var type: String?
    var resourceType: String?
    
    
    //activity view controls
    
    var height:CGFloat = 0
    var heightDiscount:CGFloat = 0
    let messageFrame = UIView()
    var strLabel = UILabel()
    let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: false)
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
            self.title = viewTitle
             navigationController?.navigationBar.largeTitleTextAttributes  = [NSAttributedStringKey(rawValue: NSAttributedStringKey.foregroundColor.rawValue): viewTitleColor ?? UIColor.black]
        } else {
             navigationController?.navigationBar.titleTextAttributes  = [NSAttributedStringKey(rawValue: NSAttributedStringKey.foregroundColor.rawValue): viewTitleColor!]
        }
        
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.center.y = self.view.center.y - 100.0
        activityIndicator.startAnimating()
        configureUIControls()
        
        if let id = self.type {
            
            if let resourceType = self.resourceType {
                switch resourceType {
                    case "case":
                        print(id)
                        activityIndicator.startAnimating()
                        Case.getByArea(area: id, completionHandler: {(cases, error) in
                            //self.legislationTypes = []
                            var caseInstances = [HomeItem]()
                            for caseInstance in cases {
                                caseInstances.append(HomeItem(title: caseInstance.name!, summary: caseInstance.summaryOfRuling ?? "", type: self.resourceType!, sourceId: caseInstance.id!))
                            }
                            self.removeIndicator()
                            self.items = caseInstances
                            self.tableView.reloadData()
                            
                        })
                    case "legislation":
                        activityIndicator.startAnimating()
                        Legislation.getByType(type: id, completionHandler: {(legislations, error) in
                            //self.legislationTypes = []
                            var legislationInstances = [HomeItem]()
                            for legislation in legislations {
                                legislationInstances.append(HomeItem(title: legislation.legislationName!, summary: legislation.preamble ?? "", type: self.resourceType!, sourceId: legislation.id!))
                            }
                            self.removeIndicator()
                            self.items = legislationInstances
                            self.tableView.reloadData()
                            
                        })
                    default:
                        print("default")
                }
            }
        
            
            
//            self.items = [HomeItem]()
            
        }
       
       
       
      

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
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
        if let items = self.items {
            return items.count
        }
        return 0
        
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIndetifier = "SummaryCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! SummaryTableViewCell
        tableView.separatorStyle = .none
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        let item = items![(indexPath as NSIndexPath).row]
        cell.name.text = item.title
        cell.summary?.text = item.summary
        return cell
    }
    /*
    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
     
        let headerCell = tableView.dequeueReusableCell(withIdentifier: "headerCell") as! HeaderTableViewCell
        headerCell.title.text? = viewTitle!
        headerCell.title.textColor = viewTitleColor!
        /*if section>0 {
         let border:UIView = UIView(frame: CGRect(x: 20,y: 4,width: ((tableView.bounds.width) - 40), height: 1))
         border.backgroundColor = UIColor(red: 230.0/255, green: 230.0/255, blue: 230.0/255, alpha: 1.0)
         headerCell.addSubview(border)
         }
         else {
         let border:UIView = UIView(frame: CGRect(x: 20,y: 2,width: ((tableView.bounds.width) - 40), height: 1))
         border.backgroundColor = UIColor(red: 100.0/255, green: 100.0/255, blue: 100.0/255, alpha: 1.0)
         headerCell.addSubview(border)
         }*/
        
        
      
        
        headerCell.accessoryType = UITableViewCellAccessoryType.none
        return headerCell
    }
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 50
    }
    */
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        
        if let indexPath = self.tableView.indexPathForSelectedRow {
            
            if segue.identifier == "showCase" {
                
                let destinationController = segue.destination as!
                CaseDetailsTableViewController
                let caseInstance = Case()
                caseInstance._id = self.items![(indexPath as NSIndexPath).row].sourceId
                destinationController.caseInstance = caseInstance
            }
            
            if segue.identifier == "showLegislation" {
                
                let destinationController = segue.destination as!
                LegislationDetailsTableViewController
                let legislationInstance = Legislation()
                legislationInstance._id = self.items![(indexPath as NSIndexPath).row].sourceId
                destinationController.legislationInstance = legislationInstance
            }
            
        }
        
      
        
        
      
        
    }
    
    
    func removeIndicator(){
        activityIndicator.stopAnimating()
    }
    
    
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedItem = self.items![(indexPath as NSIndexPath).row]
        switch selectedItem.type {
        case "case":
            self.performSegue(withIdentifier: "showCase", sender: self)
        case "legislation":
            self.performSegue(withIdentifier: "showLegislation", sender: self)

        default:
            print("nowhere to go, how did this happen?")
        }
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
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
