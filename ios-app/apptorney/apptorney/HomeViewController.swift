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
    var selectedId:String?
    
    
    
    @IBOutlet weak var dateLabel: UILabel!
    
    
    let summaryHeadings = [
        ["name":"My Bookmarks"],
        ["name":"What's New"],
        ["name":"Trending"]
    ]
    
    var bookmarks = [HomeItem]()
    var news = [HomeItem]()
    var trending = [HomeItem]()
    
    var colors:[UIColor] = []

    @objc let defaults = UserDefaults.standard;
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        print("now presenting CEO of apptorney")
        navigationController?.setNavigationBarHidden(true, animated: false)
        populateData()
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
       
        setupNavBar()
        colors.append(UIColor(hex:"D80027"))
        colors.append(UIColor(red: 255.0/255, green: 204.0/255, blue: 0.0/255, alpha: 1.0))
        colors.append(UIColor(red: 54.0/255, green: 79.0/255, blue: 107.0/255, alpha: 1.0))
        UIApplication.shared.isStatusBarHidden = false
        //let defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
        //let SessionID = defaults.objectForKey("SessionID") as! String?
        tableView.dataSource = self
        tableView.delegate = self
        configureUIControls()
        
        
        
       
        
    }
    
    func loadItems(){
        HomeItem.getBookmarks(completionHandler:{(bookmarks,error) in
            
            let userDefaults = UserDefaults.standard
            var bookmarkIds = [String]()
            for bookmark in bookmarks {
                bookmarkIds.append(bookmark.sourceId!)
            }
            userDefaults.set(bookmarkIds, forKey: "bookmarks")
            self.bookmarks = bookmarks
            if self.bookmarks.count == 0 {
                self.bookmarks.append(HomeItem(title: "No bookmarks yet", summary: "This is a sample bookmark. As you continue to use apptorney and bookmark content, those bookmarks will appear here.", type: "", sourceId: ""))
            }
            self.tableView.reloadData()
            
            
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
        
        
        HomeItem.getNews(completionHandler:{(news,error) in
            
            self.news = news ?? [HomeItem]()
            if self.news.count == 0  {
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
            }
            self.tableView.reloadData()
            
            
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
        
        
        HomeItem.getTrends(completionHandler:{(trends,error) in
            self.trending = trends ?? [HomeItem]()
            if self.trending.count == 0 {
                print("zero trending")
                self.trending.append(HomeItem(title: "No trends at the moment", summary: "Trending content appears here", type: "", sourceId: ""))
            }
            self.tableView.reloadData()
            
            
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
        
        
    }
    
    func populateData() {
         loadItems()
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
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
        
        if segue.identifier == "showCase" {
            
            let destinationController = segue.destination as!
            CaseDetailsTableViewController
            let caseInstance = Case()
            caseInstance._id = self.selectedId!
            destinationController.caseInstance = caseInstance
        }
        
        if segue.identifier == "showLegislation" {
            
            let destinationController = segue.destination as!
            LegislationDetailsTableViewController
            let legislationInstance = Legislation()
            legislationInstance._id = self.selectedId!
            destinationController.legislationInstance = legislationInstance
        }
        
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
        cell.itemsToDisplay = (cell.section==0) ? self.bookmarks : news
        
        switch cell.section {
        case 0:
            cell.itemsToDisplay = self.bookmarks
        case 1:
            cell.itemsToDisplay = self.news
        case 2:
            cell.itemsToDisplay = self.trending
        default:
             cell.itemsToDisplay = self.bookmarks
        }
        //cell.itemsToDisplay = self.bookmarks
        cell.accessoryType = UITableViewCellAccessoryType.none
        cell.collectionView.reloadData()
        cell.delegate = self as! ScrollTableViewCellDelegate
        return cell
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return summaryHeadings.count
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let item = self.summaryHeadings[section]
        let headerCell = tableView.dequeueReusableCell(withIdentifier: "headerCell") as! HeaderTableViewCell
        headerCell.title.text? = item["name"]!
        headerCell.title.textColor = colors[section]
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
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 40
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if UIScreen.main.traitCollection.horizontalSizeClass == .compact{
             return 180
        }
        return 240
    }
    
   
    
}

extension HomeViewController: ScrollTableViewCellDelegate {
    func tapped(selectedItem: HomeItem?) {
        print(selectedItem?.type)
        self.selectedId = selectedItem?.sourceId!
        if (selectedItem?.type == "case"){
            performSegue(withIdentifier: "showCase", sender: self)
        } else if selectedItem?.type == "legislation" {
            performSegue(withIdentifier: "showLegislation", sender: self)
        }
        
    }
}

