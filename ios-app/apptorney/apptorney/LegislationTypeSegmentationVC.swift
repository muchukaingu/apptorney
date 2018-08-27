//
//  LegislationTypeSegmentationVC.swift
//  apptorney
//
//  Created by Muchu Kaingu on 8/27/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

class LegislationTypeSegmentationVC: UITableViewController {
    var resourceType: String?
    //var yearArray = [String:[Int]]()
    struct Decade {
        
        var decade : String!
        var years : [Int]!
    }
    var yearArray = [Decade]()
    var volumeArray = [Int]()

    override func viewDidLoad() {
        super.viewDidLoad()
        if resourceType == "acts" || resourceType == "sis" {
            let start = resourceType == "acts" ? 1990 : 1900
            createYearMenu(start: start)
            self.title = "Select Year"
        } else if resourceType == "volumes" {
            self.title = "Select Volume"
            createVolumes()
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
    
    func createVolumes(){
        for i in 1...26 {
            volumeArray.append(i)
        }
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        var rowCount = 0
        if resourceType == "acts" || resourceType == "sis" {
            rowCount = yearArray.count
        } else if resourceType == "volumes" {
            rowCount = 1
        }
        return rowCount
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        var rowCount = 0
        if resourceType == "acts" || resourceType == "sis" {
            rowCount = 10
        } else if resourceType == "volumes" {
            rowCount = volumeArray.count
        }
        return rowCount
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "years", for: indexPath)
        if resourceType == "acts" || resourceType == "sis" {
            cell.textLabel?.text = "\(yearArray[indexPath.section].years[indexPath.row])"
        } else if resourceType == "volumes" {
            cell.textLabel?.text = "\(volumeArray[indexPath.row])"
        }
        
        
        return cell
    }
    
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        var title = ""
        if resourceType == "acts" || resourceType == "sis" {
            title = yearArray[section].decade
        } else if resourceType == "volumes" {
            title = "List of Volumes"
        }
        return title
    }
    
    override func sectionIndexTitles(for tableView: UITableView) -> [String]? {
        if resourceType == "acts" || resourceType == "sis" {
            return yearArray.map { $0.decade }
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
