//
//  CasesVC.swift
//  MR
//
//  Created by Muchu Kaingu on 3/1/15.
//  Copyright (c) 2015 Muchu Kaingu. All rights reserved.
//

import UIKit
import Foundation
//import CryptoSwift

private var defaultsContext = 0






class SettingsVC: UITableViewController, UISearchResultsUpdating, UISearchBarDelegate, ErrorViewControllerDelegate {
    
    
    
    @IBOutlet var scanButton:UIBarButtonItem!
    @objc var spinner : UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIActivityIndicatorView
    @objc var bgImage: UIImageView = UIImageView()
    @objc var aView : UIView = UIView(frame: CGRect(x: 0,y: 0, width: 50, height: 50)) as UIView
    @objc var loadingLabel: UILabel = UILabel(frame: CGRect(x: 0,y: 0, width: 200, height: 100)) as UILabel
    @objc var errorMessage: String = ""
    @objc var products = [Product]()
    @objc var departments = [Department]()
    @objc var searchController: UISearchController!
    @objc var searchResults:[Product]=[]
    @objc var keyStrokeCounter: Int = 0
    @objc var searched = 0
    @objc var categoryID = 0
    @objc var searchText = ""
    @objc var previousSelectedStore = ""
    
    @objc let defaults = UserDefaults.standard;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavBar()
        defaults.addObserver(self, forKeyPath: "CurrentStore", options: NSKeyValueObservingOptions.new, context: &defaultsContext)
        defaults.synchronize()
    }
    
    func setupNavBar(){
        if #available(iOS 11.0, *) {
            navigationController?.navigationBar.prefersLargeTitles = true
        } else {
            // Fallback on earlier versions
            print("show normal bar")
        }
    }
    

    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer!) {
        if previousSelectedStore == defaults.object(forKey: "CurrentStore") as! String{
            return
        }
        
        guard keyPath != nil else {
            super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
            return
        }
        
        switch (keyPath!, context) {
        case("CurrentStore", &defaultsContext):
            if searched == 0 {
                filterContentForSearchText(searchText)
            }
            else {
                filterContentForSearchText(searchText)
            }
        default:
            super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
        }
    }
    
    deinit {
        //Remove observer
        if isViewLoaded {
            defaults.removeObserver(self, forKeyPath: "CurrentStore", context: &defaultsContext)
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Table view data source
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Potentially incomplete method implementation.
        // Return the number of sections.
        return 3
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        var rows = 0
        //print(products.count)
        switch section {
        case 0: return 0
        case 1:
            
            
            if searched == 0 {
                rows = departments.count
            }
            else {
                rows = products.count
            }
            
        default:
            print("")
        }
        return rows
        
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell()
        switch (indexPath as NSIndexPath).section{
        case 0:
            print("")
        case 1:
            if searched==0 {
                let cellIndetifier = "DepartmentCell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! DepartmentTableViewCell
                let item = departments[(indexPath as NSIndexPath).row]
                let numberFormatter = NumberFormatter()
                numberFormatter.numberStyle = NumberFormatter.Style.decimal
                // Configure the cell...
                cell.name.text = item.name
                cell.positiveStockLabel.text = String (format:"%.0f",item.with_stk)
                cell.negativeStockLabel.text = String (format:"%.0f",item.neg_stk)
                cell.dormantStockLabel.text = String (format:"%.0f",item.dormant)
                cell.totalStockLabel.text = String (format:"%.0f",item.total_stk)
                cell.openingStockLabel.text =  "K" + numberFormatter.string(from: NSNumber(value:item.openingstk))!
                cell.rangeSoldLabel.text = String (format:"%.0f",item.rangesold)
                cell.MagicMixLabel.text = item.magicmix
                cell.ModelLabel.text = String (format:"%.0f",item.model)
                cell.departmentIcon.image = UIImage(named: item.name)
                return cell
            }
            else if searched == 1 {
                let cellIndetifier = "Cell"
                let cell = tableView.dequeueReusableCell(withIdentifier: cellIndetifier, for: indexPath) as! CustomTableViewCell
                
                
                let item = products[(indexPath as NSIndexPath).row]
                
                // Configure the cell...
                cell.mainLabel.text = item.barcode
                cell.subTitleLabel.text = item.productDescription
                cell.smallSubTitleRight.text = String (format:"%.0f",item.quantity)
                
                if self.products.count == 1 {
                    tableView.selectRow(at: indexPath, animated: false, scrollPosition: UITableViewScrollPosition.none)
                    self.performSegue(withIdentifier: "showProductDetails", sender: self)
                    //return
                }
                return cell
            }
        default:
            print("")
            
        }
        
        return cell
        
    }
    
    
    //MARK: - Search Filter
    
    @objc func filterContentForSearchText(_ searchText: String) {
        
        //let defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
        
        let API = defaults.object(forKey: "API") as! String?
        let Store = defaults.object(forKey: "CurrentStore") as! String?
        
        if Store == nil {
            
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
                //self.createBlurredSnapshop()
                self.errorMessage = "Something went wrong. \r You forgot to select a store. \r\r Please select a store by tapping the button next to the logout button and run your search again."
                self.performSegue(withIdentifier: "StoreError", sender: self)
            })
            return
        }
        
        if searchText == "Category" {
            searched=0
            
            
            
            
            
        }
        else if searchText == "CategoryItems" {
            searched=1
            tableView.reloadData()
            print(API! + "/m-retailer/product_query.php?Barcode=1&CategoryID=" + "\(categoryID)" + "&Store=" + Store!)
            DataManager.getDataFromURLWithSuccess(API! + "/m-retailer/product_query.php?Barcode=1&CategoryID=" + "\(categoryID)" + "&Store=" + Store!) { (remoteData, error) -> Void in
                
                if remoteData == nil {
                    DispatchQueue.main.async(execute: {
                        UIApplication.shared.isNetworkActivityIndicatorVisible = false
                        //self.createBlurredSnapshop()
                        self.errorMessage = "Something went wrong. \r We were unable to connect you to the selected store. \r\r Please check the connectivity status of the store from your Network Administrator. \r\r Alternatively you can try to connect to another store."
                        self.performSegue(withIdentifier: "StoreError", sender: self)
                        print("\(error)")
                        
                        
                    })
                    return
                }
                
                
                let json = JSON(data: remoteData!)
                
                if let appArray = json.array {
                    //2
                    //self.products = []
                    
                    //3
                    for appDict in appArray {
                        
                        let itemBarcode: String? = appDict["itemlookupcode"].stringValue
                        let itemDescription: String? = appDict["description"].stringValue
                        let itemQuantity: Float? = appDict["quantity"].floatValue
                        let itemCost: Float? = appDict["cost"].floatValue
                        let itemPrice: Float? = appDict["price"].floatValue
                        let itemGP: Float? = appDict["gp"].floatValue
                        let itemROS: Float? = appDict["ros"].floatValue
                        let itemDepartment: String? = appDict["department"].stringValue
                        let itemCategory: String? = appDict["category"].stringValue
                        let itemSupplier: String? = appDict["supplier"].stringValue
                        let itemLastReceived: String? = appDict["lastreceived"].stringValue
                        let itemLastReceivedQty: Float? = appDict["lastreceivedQty"].floatValue
                        let itemLastOrdered: String? = appDict["lastordered"].stringValue
                        let itemLastOrderedQty: Float? = appDict["lastorderedQty"].floatValue
                        let itemLastSold: String? = appDict["lastsold"].stringValue
                        let itemPromoStatus: Int? = appDict["promo"].intValue
                        let itemInStockPercentage: Float? = appDict["inStockPercentage"].floatValue
                        let itemLastOrderNumber: String? = appDict["lastOrderNumber"].stringValue
                        let itemDaysOnHand: Float? = appDict["daysOnHand"].floatValue
                        let itemInactive: Int? = appDict["inactive"].intValue
                        let itemDonotOrder: Int? = appDict["donotorder"].intValue
                        let itemSafetyDays: Int? = appDict["SafetyDays"].intValue
                        let itemStatMin: Int? = appDict["StatMin"].intValue
                        let itemMPQ: Int? = appDict["MasterPackQuantity"].intValue
                        let itemOpenOrders: Float? = appDict["OpenOrders"].floatValue
                        let itemSKUStatus: String? = appDict["skuStatus"].stringValue
                        let itemCategoryID: Int? = appDict["categoryid"].intValue
                        let itemDepartmentID: Int? = appDict["departmentid"].intValue
                        let itemSupplierID: Int? = appDict["supplierid"].intValue
                        let itemDailyROS: Float? = appDict["dailyros"].floatValue
                        let itemWeeklyROS: Float? = appDict["weeklyros"].floatValue
                        
                        let product = Product(barcode: itemBarcode, productDescription: itemDescription, quantity: itemQuantity, cost: itemCost, price: itemPrice, GP: itemGP, ROS: itemROS
                            , department: itemDepartment, category: itemCategory, supplier: itemSupplier, lastReceived: itemLastReceived, lastReceivedQty: itemLastReceivedQty, lastOrdered: itemLastOrdered, lastOrderedQty: itemLastOrderedQty, lastSold: itemLastSold, promoStatus: itemPromoStatus, inStockPercentage: itemInStockPercentage, lastOrderNumber: itemLastOrderNumber, daysOnHand: itemDaysOnHand, inactive: itemInactive, donotorder: itemDonotOrder, SafetyDays: itemSafetyDays, StatMin: itemStatMin, MPQ: itemMPQ, SKUStatus: itemSKUStatus, OpenOrders: itemOpenOrders, categoryID: itemCategoryID, departmentID: itemDepartmentID, supplierID: itemSupplierID, dailyros: itemDailyROS, weeklyros: itemWeeklyROS)
                        self.products.append(product)
                        self.products.sort(by: { $0.productDescription < $1.productDescription })
                        
                    }
                    
                    
                    
                    DispatchQueue.main.async(execute: {
                        
                        self.tableView.reloadData()
                        self.spinner.stopAnimating()
                        self.tableView.separatorStyle=UITableViewCellSeparatorStyle.singleLine
                        UIApplication.shared.isNetworkActivityIndicatorVisible = false
                        if self.products.count > 0 {
                            /*var height:CGFloat = 0.0
                             if self.products.count < 10 {
                             height = (CGFloat(self.products.count)/10) * self.tableView.bounds.height
                             }*/
                            
                            self.loadingLabel.isHidden=true
                        }
                        else {
                            self.loadingLabel.center.x = self.loadingLabel.center.x - 30.0
                            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
                                
                                
                                self.loadingLabel.text = "No products found."
                                
                                self.loadingLabel.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
                                
                            }, completion:nil)
                            
                            
                        }
                    })
                }
                
            }
            
            
        }
        else {
            searched=1
            tableView.reloadData()
            DataManager.getDataFromURLWithSuccess(API! + "/m-retailer/product_query.php?Barcode=" + searchText + "&Store=" + Store!) { (remoteData, error) -> Void in
                
                if remoteData == nil {
                    DispatchQueue.main.async(execute: {
                        UIApplication.shared.isNetworkActivityIndicatorVisible = false
                        //self.createBlurredSnapshop()
                        self.errorMessage = "Something went wrong. \r We were unable to connect you to the selected store. \r\r Please check the connectivity status of the store from your Network Administrator. \r\r Alternatively you can try to connect to another store."
                        self.performSegue(withIdentifier: "StoreError", sender: self)
                        print("\(error)")
                        
                        
                    })
                    return
                }
                
                
                let json = JSON(data: remoteData!)
                
                if let appArray = json.array {
                    //2
                    //self.products = []
                    
                    //3
                    for appDict in appArray {
                        
                        let itemBarcode: String? = appDict["itemlookupcode"].stringValue
                        let itemDescription: String? = appDict["description"].stringValue
                        let itemQuantity: Float? = appDict["quantity"].floatValue
                        let itemCost: Float? = appDict["cost"].floatValue
                        let itemPrice: Float? = appDict["price"].floatValue
                        let itemGP: Float? = appDict["gp"].floatValue
                        let itemROS: Float? = appDict["ros"].floatValue
                        let itemDepartment: String? = appDict["department"].stringValue
                        let itemCategory: String? = appDict["category"].stringValue
                        let itemSupplier: String? = appDict["supplier"].stringValue
                        let itemLastReceived: String? = appDict["lastreceived"].stringValue
                        let itemLastReceivedQty: Float? = appDict["lastreceivedQty"].floatValue
                        let itemLastOrdered: String? = appDict["lastordered"].stringValue
                        let itemLastOrderedQty: Float? = appDict["lastorderedQty"].floatValue
                        let itemLastSold: String? = appDict["lastsold"].stringValue
                        let itemPromoStatus: Int? = appDict["promo"].intValue
                        let itemInStockPercentage: Float? = appDict["inStockPercentage"].floatValue
                        let itemLastOrderNumber: String? = appDict["lastOrderNumber"].stringValue
                        let itemDaysOnHand: Float? = appDict["daysOnHand"].floatValue
                        let itemInactive: Int? = appDict["inactive"].intValue
                        let itemDonotOrder: Int? = appDict["donotorder"].intValue
                        let itemSafetyDays: Int? = appDict["SafetyDays"].intValue
                        let itemStatMin: Int? = appDict["StatMin"].intValue
                        let itemMPQ: Int? = appDict["MasterPackQuantity"].intValue
                        let itemOpenOrders: Float? = appDict["OpenOrders"].floatValue
                        let itemSKUStatus: String? = appDict["skuStatus"].stringValue
                        let itemCategoryID: Int? = appDict["categoryid"].intValue
                        let itemDepartmentID: Int? = appDict["departmentid"].intValue
                        let itemSupplierID: Int? = appDict["supplierid"].intValue
                        let itemDailyROS: Float? = appDict["dailyros"].floatValue
                        let itemWeeklyROS: Float? = appDict["weeklyros"].floatValue
                        
                        let product = Product(barcode: itemBarcode, productDescription: itemDescription, quantity: itemQuantity, cost: itemCost, price: itemPrice, GP: itemGP, ROS: itemROS
                            , department: itemDepartment, category: itemCategory, supplier: itemSupplier, lastReceived: itemLastReceived, lastReceivedQty: itemLastReceivedQty, lastOrdered: itemLastOrdered, lastOrderedQty: itemLastOrderedQty, lastSold: itemLastSold, promoStatus: itemPromoStatus, inStockPercentage: itemInStockPercentage, lastOrderNumber: itemLastOrderNumber, daysOnHand: itemDaysOnHand, inactive: itemInactive, donotorder: itemDonotOrder, SafetyDays: itemSafetyDays, StatMin: itemStatMin, MPQ: itemMPQ, SKUStatus: itemSKUStatus, OpenOrders: itemOpenOrders, categoryID: itemCategoryID, departmentID: itemDepartmentID, supplierID: itemSupplierID, dailyros: itemDailyROS, weeklyros: itemWeeklyROS)
                        self.products.append(product)
                        self.products.sort(by: { $0.productDescription < $1.productDescription })
                        
                    }
                    
                    
                    
                    DispatchQueue.main.async(execute: {
                        
                        self.tableView.reloadData()
                        self.spinner.stopAnimating()
                        self.tableView.separatorStyle=UITableViewCellSeparatorStyle.singleLine
                        UIApplication.shared.isNetworkActivityIndicatorVisible = false
                        if self.products.count > 0 {
                            
                            /*var height:CGFloat = 0.0
                             if self.products.count < 10 {
                             height = (CGFloat(self.products.count)/10) * self.tableView.bounds.height
                             }*/
                            self.loadingLabel.isHidden=true
                        }
                            
                        else {
                            self.loadingLabel.center.x = self.loadingLabel.center.x - 30.0
                            UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 1, initialSpringVelocity: 0.5, options: [], animations: {
                                
                                
                                self.loadingLabel.text = "No match found."
                                
                                self.loadingLabel.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
                                
                            }, completion:nil)
                            
                            
                        }
                    })
                }
                
            }
        }
    }
    
    func updateSearchResults(for searchController: UISearchController) {
        dismissSideBar()
        /*
         let footerView = UIView(frame: CGRectMake(0.0,0.0,self.tableView.bounds.width, self.tableView.bounds.height))
         footerView.backgroundColor = UIColor.whiteColor()
         self.tableView.tableFooterView = footerView //remove trailing separators after content
         */
        
        self.products.removeAll(keepingCapacity: false)
        self.tableView.reloadData()
        //self.tableView.separatorStyle=UITableViewCellSeparatorStyle.None
        if keyStrokeCounter == 0 && loadingLabel.text != "Loading..." {
            resetLoadingLabel(30.0)
        }
        else {
            resetLoadingLabel(0.0)
        }
        
        keyStrokeCounter += 1
        
    }
    
    func  searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        searched = 0
        dismissSideBar()
        self.spinner.stopAnimating()
        self.products.removeAll(keepingCapacity: false)
        self.tableView.reloadData()
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
        resetLoadingLabel(0.0)
        //        self.tableView.contentInset = UIEdgeInsetsMake(60, 0, 0, 0);
        print("Cancelled...")
        restoreNavBar()
        
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        
        dismissSideBar()
        keyStrokeCounter = 0
        self.spinner.startAnimating()
        self.loadingLabel.isHidden=false
        self.tableView.separatorStyle=UITableViewCellSeparatorStyle.none
        self.products.removeAll(keepingCapacity: false)
        self.tableView.reloadData()
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        
        let searchText = self.searchController.searchBar.text
        
        let cleanSearchText = searchText!.replacingOccurrences(
            of: "\\s+",
            with: "%20",
            options: .regularExpression)
        
        
        
        
        
        self.filterContentForSearchText(cleanSearchText)
        
        
        
        
    }
    
    @objc func configureUIControls () { //for cutomising controls on the UI
        print("configuring...")
        self.tableView.contentInset = UIEdgeInsetsMake(0,0,0,0);
        // 1. UITableView Customisation
        
        //self.tableView.separatorInset=UIEdgeInsets(top: 0.0, left: 10, bottom: 0.0, right: 20.0)
        self.tableView.separatorStyle=UITableViewCellSeparatorStyle.none //remove separators before search
        self.tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        
        // 2. Loading Message Configuration - UIActivityView and UILabel
        
        var margin: CGFloat = 45.0
        spinner.center.x = self.view.center.x - margin //move left to accommodate "Loading..." label
        spinner.center.y = self.view.center.y - 90 //move up to center
        spinner.hidesWhenStopped = true //hide before search
        spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray //type of UIActivityView (small)
        view.addSubview(spinner) //Add to View
        //self.spinner.startAnimating()
        
        margin = 75.0
        loadingLabel.center.x = self.view.center.x + margin
        loadingLabel.center.y = self.view.center.y - 90.0
        loadingLabel.text="Loading..."
        loadingLabel.textColor = UIColor.gray
        loadingLabel.isHidden=true
        
        view.addSubview(loadingLabel)
        //refer to spinner documentation
        
        
        // 3. UISearchController Configuration - Also add it to NavBar
        
        /*
         searchController = UISearchController(searchResultsController:nil)
         searchController.searchBar.sizeToFit()
         searchController.searchBar.placeholder="Search by barcode or description"
         searchController.searchBar.barTintColor=UIColor.whiteColor()
         searchController.searchBar.tintColor=UIColor.whiteColor()
         searchController.searchBar.searchBarStyle = UISearchBarStyle.Minimal
         tableView.tableHeaderView = searchController.searchBar
         tableView.tableHeaderView?.backgroundColor=UIColor(red: 2.0/255, green: 160.0/255, blue: 243.0/255, alpha: 1.0)
         
         //        let backView = UIView(frame: CGRectMake(0.0, 0.0, 0.0, 0.0))
         //        backView.backgroundColor = UIColor(red: 2.0/255, green: 160.0/255, blue: 243.0/255, alpha: 1.0)
         //        self.tableView.backgroundView = backView
         
         definesPresentationContext = true
         searchController.searchResultsUpdater=self
         searchController.dimsBackgroundDuringPresentation=false
         self.searchController.searchBar.delegate = self
         searchController.hidesNavigationBarDuringPresentation = false
         //navigationItem.titleView = searchController.searchBar //add to NavBar
         let textFieldInsideSearchBar = searchController.searchBar.valueForKey("searchField") as? UITextField //Change text color to white
         
         searchController.searchBar.setImage(UIImage(named: "search-new"), forSearchBarIcon: UISearchBarIcon.Search, state: UIControlState.Normal);
         searchController.searchBar.setImage(UIImage(named: "search-cancel"), forSearchBarIcon: UISearchBarIcon.Clear, state: UIControlState.Normal);
         
         if textFieldInsideSearchBar!.respondsToSelector(Selector("attributedPlaceholder")) {
         
         let attributeDict = [NSForegroundColorAttributeName: UIColor(red: 255.0/255, green: 255.0/255, blue: 255.0/255, alpha: 0.9)]
         textFieldInsideSearchBar!.attributedPlaceholder = NSAttributedString(string: "Search by barcode or description", attributes: attributeDict)
         }
         textFieldInsideSearchBar?.textColor = UIColor.whiteColor()  //Change text color to white
         
         */
        
    }
    
    // MARK: - Navigation
    
   
    
    
    //MARK: - BarcodeScanner Protocol Methods
    
    
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
    
    @objc func addRightNavItemOnView(){
        
        let buttonEdit: UIButton = UIButton(type: UIButtonType.custom)
        buttonEdit.frame = CGRect(x: 0, y: 0, width: 40, height: 40)
        buttonEdit.setImage(UIImage(named:"menu-new-1.png"), for: UIControlState())
        buttonEdit.addTarget(self.revealViewController(), action: #selector(SWRevealViewController.revealToggle(_:)), for: UIControlEvents.touchUpInside)
        let rightBarButtonItemEdit: UIBarButtonItem = UIBarButtonItem(customView: buttonEdit)
        
        /*let backButton: UIButton = UIButton(type: UIButtonType.custom)
        backButton.frame = CGRect(x: 0, y: 0, width: 23, height: 23)
        backButton.setImage(UIImage(named:"back3.png"), for: UIControlState())
        backButton.addTarget(self, action: #selector(ProductSearchVC.goBack), for: UIControlEvents.touchUpInside)
        let backButtonItem: UIBarButtonItem = UIBarButtonItem(customView: backButton)
        */
        
         let searchButton: UIButton = UIButton(type: UIButtonType.custom)
         searchButton.frame = CGRect(x: 0, y: 0, width: 40, height: 40)
         searchButton.setImage(UIImage(named:"search-new"), for: UIControlState())
        
         let rightSearchBarButtonItem: UIBarButtonItem = UIBarButtonItem(customView: searchButton)
         
         let scanButton: UIButton = UIButton(type: UIButtonType.custom)
         scanButton.frame = CGRect(x: 0, y: 0, width: 40, height: 40)
         scanButton.setImage(UIImage(named:"barcode1"), for: UIControlState())
       
         let rightScanBarButtonItem: UIBarButtonItem = UIBarButtonItem(customView: scanButton)
        
        let spaceFix: UIBarButtonItem = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.fixedSpace, target: nil, action: nil)
        spaceFix.width = -16
        
        /*
         
         let buttonDelete: UIButton = UIButton(type: UIButtonType.Custom)
         buttonDelete.frame = CGRectMake(0, 0, 40, 40)
         buttonDelete.setImage(UIImage(named:"back3.png"), forState: UIControlState.Normal)
         buttonDelete.addTarget(self.revealViewController(), action: "done:", forControlEvents: UIControlEvents.TouchUpInside)
         
         
         
         
         let rightBarButtonItemDelete: UIBarButtonItem = UIBarButtonItem(customView: buttonDelete)
         */
        
        
        self.navigationItem.setLeftBarButtonItems([spaceFix, rightBarButtonItemEdit], animated: true)
        self.navigationItem.setRightBarButtonItems([spaceFix, rightSearchBarButtonItem, spaceFix, rightScanBarButtonItem], animated: true)//(rightSearchBarButtonItem, animated: true)
        // uncomment to add single right bar button item
        // self.navigationItem.setRightBarButtonItem(rightBarButtonItem, animated: false)
        
    }
    
    @objc func dismissSideBar() {
        if self.revealViewController() != nil {
            self.revealViewController().rightRevealToggle(self)
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
            self.tableView.reloadData()
        }
    }
    
    override func  tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        dismissSideBar()
    }
    
    @objc func  ErrorViewControllerDidCancel(_ controller: ErrorViewController) {
        
        self.dismiss(animated: true, completion: nil)
        
        
        //The call has to be made twice because of a bug I havent quite gotten my head around... If it is called once, the user has to press the "X" twice to dismiss the dialogue.
        
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
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        var height:CGFloat = 0.0
        if searched == 0 {
            height = 160.0
        }
        else if searched == 1 {
            height = 60.0
            
        }
        
        return height
    }
    
   
    
    @objc func showSearchBar()
    {
        
        /*
         
         let buttonDelete: UIButton = UIButton(type: UIButtonType.Custom)
         buttonDelete.frame = CGRectMake(0, 0, 40, 40)
         buttonDelete.setImage(UIImage(named:"back3.png"), forState: UIControlState.Normal)
         buttonDelete.addTarget(self.revealViewController(), action: "done:", forControlEvents: UIControlEvents.TouchUpInside)
         
         
         
         
         let rightBarButtonItemDelete: UIBarButtonItem = UIBarButtonItem(customView: buttonDelete)
         */
        
        
        let btn:UIBarButtonItem = UIBarButtonItem()
        
        self.navigationItem.setLeftBarButton(nil, animated: true)
        self.navigationItem.setRightBarButtonItems([btn,btn], animated: true)//(rightSearchBarButtonItem, animated: true)
        
        
        print("Show Search Bar")
        searchController = UISearchController(searchResultsController:nil)
        searchController.searchBar.sizeToFit()
        searchController.searchBar.placeholder="Search by barcode or description"
        searchController.searchBar.barTintColor=UIColor.white
        searchController.searchBar.tintColor=UIColor.white
        searchController.searchBar.searchBarStyle = UISearchBarStyle.minimal
        
        //tableView.tableHeaderView = searchController.searchBar
        //tableView.tableHeaderView?.backgroundColor=UIColor(red: 2.0/255, green: 160.0/255, blue: 243.0/255, alpha: 1.0)
        
        //        let backView = UIView(frame: CGRectMake(0.0, 0.0, 0.0, 0.0))
        //        backView.backgroundColor = UIColor(red: 2.0/255, green: 160.0/255, blue: 243.0/255, alpha: 1.0)
        //        self.tableView.backgroundView = backView
        
        definesPresentationContext = true
        searchController.searchResultsUpdater=self
        searchController.dimsBackgroundDuringPresentation=false
        self.searchController.searchBar.delegate = self
        searchController.hidesNavigationBarDuringPresentation = false
        navigationItem.titleView = searchController.searchBar //add to NavBar
        let textFieldInsideSearchBar = searchController.searchBar.value(forKey: "searchField") as? UITextField //Change text color to white
        
        searchController.searchBar.setImage(UIImage(named: "searchicon"), for: UISearchBarIcon.search, state: UIControlState());
        searchController.searchBar.setImage(UIImage(named: "search-cancel"), for: UISearchBarIcon.clear, state: UIControlState());
        
        if textFieldInsideSearchBar!.responds(to: #selector(getter: UITextField.attributedPlaceholder)) {
            
            let attributeDict = [NSAttributedStringKey.foregroundColor: UIColor(red: 255.0/255, green: 255.0/255, blue: 255.0/255, alpha: 0.9)]
            textFieldInsideSearchBar!.attributedPlaceholder = NSAttributedString(string: "Search", attributes: attributeDict)
        }
        textFieldInsideSearchBar?.textColor = UIColor.white  //Change text color to white
        
        searchController.searchBar.becomeFirstResponder()
        
    }
    
    @objc func restoreNavBar() { // Restores Nav Bar to state before search
        addRightNavItemOnView()
        let title:UILabel = UILabel()
        title.frame = CGRect(x: 0, y: 0, width: 40, height: 100)
        let barFont = UIFont(name: "HelveticaNeue", size: 22.0)
        title.attributedText = NSAttributedString(string: "m-retailer", attributes: [NSAttributedStringKey.foregroundColor: UIColor.white, NSAttributedStringKey.font:barFont!])
        navigationItem.titleView = title
        
    }
    
    @objc func openBarcodeScanner (){
        self.performSegue(withIdentifier: "scanBarcode", sender: self)
    }
    
    
    
    
    
    
}
