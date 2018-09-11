//
//  CaseCategoriesSegmentationVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/28/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class CaseCategoriesSegmentationVC: UITableViewController {
    
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()

    var resourceType: String?
    //var yearArray = [String:[Int]]()
    struct Decade {
        
        var decade : String!
        var years : [Int]!
    }
    var yearArray = [Decade]()
    var areas = [AreaOfLaw]()
    var areaInitials = [String]()
    var areaDictionary = [String:[AreaOfLaw]]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if resourceType == "years" {
            let start = 1900
            createYearMenu(start: start)
            self.title = "Select Year"
        } else if resourceType == "themes" {
            self.tableView.tableFooterView = UIView()
            self.title = "Select Domain"
            self.view.addSubview(activityIndicator)
            activityIndicator.center = self.view.center
            activityIndicator.center.y = self.view.center.y - 100.0
            activityIndicator.startAnimating()
            
            createAreas()
        }
        
        
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false
        
        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    
    func createYearMenu(start: Int){
        for i in start...2017 {
            if i % 10 == 0 {
                var years = [Int]()
                for x in 0..<10 {
                    years.append(i+x)
                }
                yearArray.append(Decade(decade: "\(i)s", years: years)) //["\(i)s"] = years
            }
            
        }
        
    }
    
    func createAreas(){
        AreaOfLaw.search(completionHandler:{(areas,error) in
            self.areas = areas.sorted(by: {$0.name! < $1.name!})
            for area in self.areas {
                let initial = String(area.name!.prefix(1))
                if var areaValues = self.areaDictionary[initial] {
                    areaValues.append(area)
                    self.areaDictionary[initial] = areaValues
                } else {
                    self.areaDictionary[initial] = [area]
                }
            }
            
            self.areaInitials = [String](self.areaDictionary.keys).sorted(by: { $0 < $1 })
            self.activityIndicator.stopAnimating()
            self.tableView.reloadData()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
    }
    
    // MARK: - Table view data source
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        var rowCount = 0
        if resourceType == "years" {
            rowCount = yearArray.count
        } else if resourceType == "themes" {
            rowCount = self.areaInitials.count
        }
        return rowCount
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        var rowCount = 0
        if resourceType == "years" {
            rowCount = 10
        } else if resourceType == "themes" {
            let initial = areaInitials[section]
            if let areaValues = areaDictionary[initial] {
                rowCount = areaValues.count
            }
        }
        return rowCount
    }
    
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "years", for: indexPath)
        if resourceType == "years" {
            cell.textLabel?.text = "\(yearArray[indexPath.section].years[indexPath.row])"
        } else if resourceType == "themes" {
            let initial = areaInitials[indexPath.section]
            if let areaValues = areaDictionary[initial] {
                cell.textLabel?.text = areaValues[indexPath.row].name!
            }
        }
        
        
        return cell
    }
    
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        var title = ""
        if resourceType == "years" {
            title = yearArray[section].decade
        } else if resourceType == "themes" {
            title = areaInitials[section]
        }
        return title
    }
    
    override func sectionIndexTitles(for tableView: UITableView) -> [String]? {
        if resourceType == "years" {
            return yearArray.map { $0.decade }
        } else if resourceType == "themes"{
            return areaInitials
        }
        return [String]()
    }
    
    
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        guard let header = view as? UITableViewHeaderFooterView else { return }
        header.textLabel?.textColor = UIColor.black
        header.textLabel?.font = UIFont.boldSystemFont(ofSize: 24)
        header.textLabel?.frame = header.frame
        header.textLabel?.textAlignment = .left
    }
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 60
    }
    
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    
            performSegue(withIdentifier: "showListofCases", sender: self)
        
        
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let destinationController = segue.destination as!
        HomeDetailsTableViewController
        destinationController.resourceType = "case"
        destinationController.type = ""
        
        if let indexPath = self.tableView.indexPathForSelectedRow {
            print("in segue, mofo")
            let destinationController = segue.destination as!
            HomeDetailsTableViewController
            if self.resourceType == "themes" {
                destinationController.resourceType = "caseByArea"
                
                
                let initial = areaInitials[indexPath.section]
                if let areaValues = areaDictionary[initial] {
                    
                    destinationController.type = areaValues[indexPath.row].id
                    destinationController.viewTitle = areaValues[indexPath.row].name
                }
            } else if self.resourceType == "years" {
                destinationController.resourceType = "caseByYear"
                
                
                let year = yearArray[indexPath.section].years![indexPath.row]
                print(year)
        
                    
                destinationController.year = year
                destinationController.viewTitle = "\(year) Cases"
            
            }
            
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
     // Get the new view controller using segue.destination.
     // Pass the selected object to the new view controller.
     }
     */


}
