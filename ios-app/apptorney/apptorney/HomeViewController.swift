//
//  HomeViewController.swift
//  apptorney
//  Created by Muchu Kaingu on 11/09/17.
//  Copyright (c) 2017 Circuit Business Solutions. All rights reserved.
//

import UIKit
import Foundation
import Windless


private var defaultsContext = 0

class HomeViewController: UIViewController {
    //New minimalist activity indicator
    lazy private var activityIndicator : SYActivityIndicatorView = {
        let image = UIImage(named: "spinner.png")
        return SYActivityIndicatorView(image: image)
    }()
    
    var msgLabel = UILabel()
    var errorImage = UIImageView()
    var tryAgainButton = UIButton()




    @IBOutlet weak var apptorneyLabel: UILabel!
    @IBOutlet var scanButton:UIBarButtonItem!
    @IBOutlet weak var separatorBar: UIView!
    @IBOutlet weak var userIcon: UIImageView!
    
    @objc var spinner : UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIActivityIndicatorView
    @objc var bgImage: UIImageView = UIImageView()
    @objc var aView : UIView = UIView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIView
  
    @objc var searchController: UISearchController!
    @objc var searchResults:[Product]=[]
    @objc var keyStrokeCounter: Int = 0
    @objc var searched = 0
    @objc var searchQuery = ""
    @objc var previousSelectedStore = ""
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var collectionView: UICollectionView!
    var selectedId:String?
    
    var selectedIndexForSeeAll:Int?
    var loaded = false
    
    
    
    @IBOutlet weak var dateLabel: UILabel!
    
    
    let summaryHeadings = [
        ["name":"MY BOOKMARKS"],
        ["name":"WHAT'S NEW"],
        ["name":"TRENDING"]
    ]
    
    var bookmarks = [HomeItem]()
    var news = [HomeItem]()
    var trending = [HomeItem]()
    
    var colors:[UIColor] = []

    @objc let defaults = UserDefaults.standard;
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.view.addSubview(activityIndicator)
        activityIndicator.center = self.view.center
        activityIndicator.startAnimating()
        self.tableView.isHidden = true
        loaded = false
        hideControlsWhileLoading()
        loadPlaceholders()
        tableView.reloadData()
        print("viewWillAppear")
        navigationController?.setNavigationBarHidden(true, animated: false)
        populateData()
        
    }
    
    func hideControlsWhileLoading(){
        dateLabel.isHidden = true
        separatorBar.isHidden = true
        userIcon.isHidden = true
        apptorneyLabel.isHidden = true
    }
    
    func showControlsAfterLoading(){
        dateLabel.isHidden = false
        separatorBar.isHidden = false
        userIcon.isHidden = false
        apptorneyLabel.isHidden = false
    }
    
    
    
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
//        self.tableView.reloadData()
        print("viewDidAppear")
        //Loader.addLoaderTo(self.tableView)
       
        
        
    }
    
    func loadPlaceholders(){
        self.bookmarks=[]
        self.news=[]
        self.trending=[]
        self.bookmarks.append(HomeItem(title: "No bookmarks yet", summary: "This is a sample bookmark. As you continue to use apptorney and bookmark content, those bookmarks will appear here.", type: "", sourceId: ""))
        self.news.append(HomeItem(title: "Loading Content...", summary: "Please wait", type: "", sourceId: ""))
        self.news.append(HomeItem(title: "Loading Content...", summary: "Please wait", type: "", sourceId: ""))
        self.news.append(HomeItem(title: "Loading Content...", summary: "Please wait", type: "", sourceId: ""))
        self.trending.append(HomeItem(title: "Loading Content...", summary: "Please wait", type: "", sourceId: ""))
        //Loader.addLoaderTo(self.tableView)
        
    }
 
    
    override func viewDidLoad() {
        super.viewDidLoad()
       
        //setupNavBar()
        colors.append(UIColor(hex:"D80027"))
        colors.append(UIColor(hex:"007AFF"))
        //colors.append(UIColor(red: 255.0/255, green: 204.0/255, blue: 0.0/255, alpha: 1.0))
        colors.append(UIColor(red: 54.0/255, green: 79.0/255, blue: 107.0/255, alpha: 1.0))
        UIApplication.shared.isStatusBarHidden = false
        //let defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
        //let SessionID = defaults.objectForKey("SessionID") as! String?
        tableView.dataSource = self
        tableView.delegate = self
        configureUIControls()
        
        //checkSubscription()
        
        
        
        
    
        
        
        
       
        
    }
    
    func checkSubscription(){
        let subscriptionValidity = false
        if subscriptionValidity == false {
            self.performSegue(withIdentifier: "subscriptionRenewal", sender: self)
        }
    }
    
    @objc func reloadView(){
        print("Try Again")
        self.viewWillAppear(true)
        self.viewDidAppear(true)
        clearScreen()
    }
    
    func displayError(title: String, message:String){
        //1. Create the alert controller.
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        
        // 2. Grab the value from the text field, and print it when the user clicks OK.
        alert.addAction(UIAlertAction(title: NSLocalizedString("OK", comment: "Default action"), style: .default, handler: { _ in
            self.showPermanentErrorOnScreen()
        }))
        
        alert.addAction(UIAlertAction(title: NSLocalizedString("Try Again", comment: "Default action"), style: .default, handler: { _ in
           self.reloadView()
        }))
        
        // 3. Present the alert.
        self.present(alert, animated: true, completion: nil)
    }
    
    func showPermanentErrorOnScreen(){
        self.msgLabel = UILabel(frame:CGRect(x: self.view.frame.midX -  144, y: self.view.frame.midY - 30 , width: 280, height: 200))
        msgLabel.text = "In order to use Apptorney, please ensure that you have an active Internet connection. When you have verified that you have an active Internet connection, please tap the Try Again button below."
        //msgLabel.sizeToFit()
        self.msgLabel.numberOfLines = 7
        self.msgLabel.lineBreakMode = .byWordWrapping
        self.msgLabel.textAlignment = .center
        
        //msgLabel.frame = CGRect(x: self.view.frame.midX -  msgLabel.frame.width/2, y: self.view.frame.midY - 40 , width: 300, height: 46)
        self.view.addSubview(msgLabel)
        msgLabel.font = UIFont.systemFont(ofSize: 17, weight: .thin)
        
        self.errorImage = UIImageView(frame:CGRect(x: self.view.frame.midX -  48, y: self.view.frame.midY - 149.4 , width: 100, height: 109.4))
        errorImage.image = UIImage(named: "case-law")
        self.view.addSubview(errorImage)
        
        
        self.tryAgainButton = UIButton(frame:CGRect(x: 30.0, y: self.view.frame.maxY - 100 , width: self.view.frame.width - 60, height: 50))
        self.tryAgainButton.backgroundColor = UIColor.black
        self.tryAgainButton.setTitle("Try Again", for: .normal)
        self.tryAgainButton.layer.cornerRadius = self.tryAgainButton.frame.height/5
        self.tryAgainButton.addTarget(self, action: #selector(reloadView), for: .touchUpInside)
        self.view.addSubview(tryAgainButton)
        
        
    }
    
    func clearScreen() {
        self.msgLabel.removeFromSuperview()
        self.errorImage.removeFromSuperview()
        self.tryAgainButton.removeFromSuperview()
    }
    

    func loadItems(){
        HomeItem.getBookmarks(completionHandler:{(bookmarks,error) in
            if bookmarks == nil {
                print("error occured")
                self.activityIndicator.stopAnimating()
                self.displayError(title: "No Connection", message: "An Internet connection problem has occured. Please check your Internet connection and try again.")
                return
            }
            let userDefaults = UserDefaults.standard
            var bookmarkIds = [String]()
            for bookmark in bookmarks! {
                bookmarkIds.append(bookmark.sourceId!)
            }
            userDefaults.set(bookmarkIds, forKey: "bookmarks")
            self.bookmarks = bookmarks!
            if self.bookmarks.count == 0 {
                self.bookmarks.append(HomeItem(title: "No bookmarks yet", summary: "This is a sample bookmark. As you continue to use apptorney and bookmark content, those bookmarks will appear here.", type: "", sourceId: ""))
            }
            self.loaded = true
            self.tableView.isHidden = false
            self.tableView.reloadData()
            self.activityIndicator.stopAnimating()
            self.tabBarController?.tabBar.isHidden = false
            
            
            self.setupNavBar()
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
        
        
        HomeItem.getNews(completionHandler:{(news,error) in
            
            self.news = news ?? [HomeItem]()
            if self.news.count == 0  {
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
                self.news.append(HomeItem(title: "No new items", summary: "Updated content appears here", type: "", sourceId: ""))
            }
            self.loaded = true
            print("News \(self.news.count)")
            //self.activityIndicator.stopAnimating()
            //Loader.removeLoaderFrom(self.tableView)
            self.tableView.reloadData()
            
            
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
        })
        
        
        HomeItem.getTrends(completionHandler:{(trends,error) in
            self.trending = trends ?? [HomeItem]()
            if self.trending.count == 0 {
                print("zero trending")
                self.trending.append(HomeItem(title: "No trends at the moment", summary: "Trending content appears here", type: "", sourceId: ""))
            }
            //self.tableView.isHidden = false
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
        showControlsAfterLoading()
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
        dateLabel.text = monthFormatter.string(from: date).uppercased()
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
        
        
        if segue.identifier == "homeDetails" {
            
            let destinationController = segue.destination as!
            HomeDetailsTableViewController
            
            switch selectedIndexForSeeAll {
            case 0:
                destinationController.items = self.bookmarks.reversed()
            case 1:
                destinationController.items = self.news.reversed()
            case 2:
                destinationController.items = self.trending.reversed()
            default:
                destinationController.items = [HomeItem]()
            }
            destinationController.viewTitle = summaryHeadings[selectedIndexForSeeAll!]["name"]
            destinationController.viewTitleColor = self.colors[selectedIndexForSeeAll!]
            
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
        tableView.backgroundColor = UIColor.white
        
       
        
    }




}

extension HomeViewController:UITableViewDelegate {
    
    
}

extension HomeViewController:UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        var cellIdentifier = "scrollCell"
    
        if loaded {
            cellIdentifier = "scrollCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as! ScrollTableViewCell
            cell.section = indexPath.section
            cell.itemsToDisplay = (cell.section==0) ? self.bookmarks : news
            
            switch cell.section {
            case 0:
                cell.itemsToDisplay = self.bookmarks.reversed()
            case 1:
                cell.itemsToDisplay = self.news.reversed()
            case 2:
                cell.itemsToDisplay = self.trending.reversed()
            default:
                cell.itemsToDisplay = self.bookmarks.reversed()
            }
            
            //cell.itemsToDisplay = self.bookmarks
            cell.accessoryType = UITableViewCellAccessoryType.none
            cell.collectionView.reloadData()
            cell.delegate = self as ScrollTableViewCellDelegate
            return cell
            
        } else {
            cellIdentifier = "skeletonCell"
            let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath)
            return cell
        }
        
        return UITableViewCell()
        
        
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return summaryHeadings.count
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let item = self.summaryHeadings[section]
        let headerCell = tableView.dequeueReusableCell(withIdentifier: "headerCell") as! HeaderTableViewCell
        headerCell.title.text? = item["name"]!
        headerCell.title.textColor = colors[section]
        headerCell.backgroundColor = UIColor.white
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
        
        
        headerCell.tapObject = {
                //Do whatever you want to do when the button is tapped here
                self.selectedIndexForSeeAll = section
                self.performSegue(withIdentifier: "homeDetails", sender: self)
        }

        headerCell.accessoryType = UITableViewCellAccessoryType.none
        
        return headerCell
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        
        if !loaded {
            return 0
        }
        return 20
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
        self.selectedId = selectedItem?.sourceId!
        if (selectedItem?.type == "case"){
            performSegue(withIdentifier: "showCase", sender: self)
        } else if selectedItem?.type == "legislation" {
            performSegue(withIdentifier: "showLegislation", sender: self)
        }
        
    }
}

