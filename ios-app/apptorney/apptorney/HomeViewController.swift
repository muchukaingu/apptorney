//
//  HomeViewController.swift
//  apptorney
//  Created by Muchu Kaingu on 11/09/17.
//  Copyright (c) 2017 Circuit Business Solutions. All rights reserved.
//

import UIKit
import Foundation

private var defaultsContext = 0

class HomeViewController: UIViewController {



    @IBOutlet var scanButton:UIBarButtonItem!
    @objc var spinner : UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIActivityIndicatorView
    @objc var bgImage: UIImageView = UIImageView()
    @objc var aView : UIView = UIView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIView
    @objc var loadingLabel: UILabel = UILabel(frame: CGRect(x: 0,y: 0, width: 215, height: 100)) as UILabel
    @objc var errorMessage: String = ""
    @objc var products = [Product]()
    @objc var departments = [[String:String]]()
    @objc var searchController: UISearchController!
    @objc var searchResults:[Product]=[]
    @objc var keyStrokeCounter: Int = 0
    @objc var searched = 0
    @objc var searchQuery = ""
    @objc var previousSelectedStore = ""
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var collectionView: UICollectionView!
    
    
    
    @IBOutlet weak var dateLabel: UILabel!
    
    
    let summaryHeadings = [
        ["name":"My Bookmarks"],
        ["name":"What's New"],
        ["name":"New Cases"]
    ]
    
    var cases = [HomeItem]()
    var news = [HomeItem]()
    var trending = [HomeItem]()
    
    var colors:[UIColor] = []
   

    @objc let defaults = UserDefaults.standard;
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavBar()
        colors.append(UIColor(red: 252.0/255, green: 81.0/255, blue: 133.0/255, alpha: 1.0))
        colors.append(UIColor(red: 54.0/255, green: 79.0/255, blue: 107.0/255, alpha: 1.0))
        colors.append(UIColor(red: 255.0/255, green: 204.0/255, blue: 0.0/255, alpha: 1.0))
        UIApplication.shared.isStatusBarHidden = false
        //let defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
        //let SessionID = defaults.objectForKey("SessionID") as! String?
        tableView.dataSource = self
        tableView.delegate = self
        configureUIControls()
        populateData()
        
       
        
    }
    
    func populateData() {
        cases.append(HomeItem(name:"KALUSHA BWALYA VS. CHARDORE PROPERTIES LIMITED AND ANOTHER".capitalized, summary:"This matter came up for hearing of two applications filed by the Plaintiff for review and stay of judgment pending the application for third party proceedings."))
        news.append(HomeItem(name:"STANBIC BANK ZAMBIA LIMITED VS. SAVENDA MANAGEMENT SERVICES".capitalized, summary:"The concept of credit referencing was fairly alien to the Zambian banking and financial sector until the year 2006"))
        news.append(HomeItem(name:"THE CONSTITUTIONAL COURT ACT".capitalized, summary:"An Act to provide for the printing and publication of the Constitution; to provide for the savings and transitional provisions of existing State organs..."))
        news.append(HomeItem(name:"THE BANKING AND FINANCIAL SERVICES ACT, 2017".capitalized, summary:"An Act to provide for a licensing system for the conduct of banking or financial business and provision of financial services..."))
    }
    
    func setupNavBar(){

//        let label = UILabel(frame: CGRect(x:0, y:0, width:400, height:50))
//        label.backgroundColor = UIColor.clear
//        label.numberOfLines = 2
//        label.font = UIFont(name: "Torus-Regular", size: 26.0)
//        label.textAlignment = .center
//        label.textColor = UIColor.black
        let headerView = UIView(frame: CGRect(x:0, y:0, width:400, height:50))
        let logo = UIImageView(frame: CGRect(x:self.view.bounds.midX-30, y:2, width:35, height:35))
        logo.image=UIImage(named: "login-icon")
        headerView.addSubview(logo)
//        promoStatus.image=UIImage(named: "kvi4")
        let date = Date()
        let dayFormatter = DateFormatter()
        let monthFormatter = DateFormatter()
        dayFormatter.dateFormat = "EEEE"
        monthFormatter.dateFormat = "MMMM d"
        //self.navigationItem.title = formatter.string(from: date).uppercased()
        dateLabel.text = dayFormatter.string(from: date).uppercased() + "\n" + monthFormatter.string(from: date).uppercased()
//        label.text = "apptorney"
        //self.navigationItem.titleView = headerView
        if #available(iOS 11.0, *) {
            //navigationController?.navigationBar.prefersLargeTitles = true
            //self.navigationItem.title = dayFormatter.string(from: date)
        } else {
            // Fallback on earlier versions
        }
        //navigationItem.searchController = searchController

    }
    

    deinit {
        //Remove observer
        defaults.removeObserver(self, forKeyPath: "CurrentStore", context: &defaultsContext)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    

    override var prefersStatusBarHidden : Bool {
        return false
    }

    func resetLoadingLabel(_ margin: CGFloat?) {
        loadingLabel.text = "Loading..."
        loadingLabel.isHidden = true
        spinner.stopAnimating()
        loadingLabel.textColor = UIColor.gray
        UIView.animate(withDuration: 0.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
            self.loadingLabel.transform = CGAffineTransform(scaleX: 1.0, y: 1.0)
            }, completion:nil)
        self.loadingLabel.center.x = self.loadingLabel.center.x + margin!
    }


   
    @objc func createBlurredSnapshop() -> UIImageView {

        let layer = UIApplication.shared.keyWindow!.layer
        let scale = UIScreen.main.scale
        let bgView : UIImageView = UIImageView()
        bgImage.frame = layer.frame
        bgView.frame = layer.frame

        UIGraphicsBeginImageContextWithOptions(layer.frame.size, false, scale);

        layer.render(in: UIGraphicsGetCurrentContext()!)
        let screenshot = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        let blurEffect = UIBlurEffect(style: UIBlurEffectStyle.dark)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame=layer.frame
        bgView.image = screenshot

        bgView.addSubview(blurEffectView)
        return bgView
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        tableView.contentInset = UIEdgeInsetsMake(0,0,0,0);
        
        // 1. UITableView Customisation
        tableView.separatorStyle=UITableViewCellSeparatorStyle.none //remove separators before search
        tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        
       
        
    }




}

extension HomeViewController:UITableViewDelegate {
    
    
}

extension HomeViewController:UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIndetifier = "scrollCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! ScrollTableViewCell
        cell.section = indexPath.section
        cell.itemsToDisplay = (cell.section==0) ? cases : news
        cell.accessoryType = UITableViewCellAccessoryType.none

        return cell
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return summaryHeadings.count
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let item = self.summaryHeadings[section]
        let headerCell = tableView.dequeueReusableCell(withIdentifier: "headerCell") as! HeaderTableViewCell
        headerCell.title.text? = item["name"]!
        //headerCell.name.textColor = colors[section]
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
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 180
    }
    
   
    
}

