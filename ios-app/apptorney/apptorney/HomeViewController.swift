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
    private struct ChatReference {
        let source: String
        let id: String
        let type: String
        let title: String
    }

    private struct ChatThreadSummary {
        let id: String
        let title: String
        let updatedAt: String
        let lastQuestion: String
    }

    private struct ChatMessage {
        var text: String
        let isUser: Bool
        var references: [ChatReference] = []
    }

    private let isChatInterfaceEnabled = true
    private let askAIEndpoint = "/searches/ask-ai"
    private let chatThreadsEndpoint = "/searches/chat-threads"
    private var chatMessages: [ChatMessage] = []
    private var currentThreadId: String?
    private var chatThreads: [ChatThreadSummary] = []
    private var isLoadingChatThreads = false
    private var isAwaitingAIResponse = false
    private var isStreamingAIResponse = false
    private var typingAnimationTimer: Timer?
    private var aiStreamingTimer: Timer?
    private var typingAnimationStep = 0
    private var streamingCharacters: [Character] = []
    private var streamingMessageIndex: Int?
    private var streamingCharacterCursor = 0
    private var lastStreamingRenderTime: TimeInterval = 0
    private var pendingStreamingReferences: [ChatReference] = []
    private var chatInputBottomConstraint: NSLayoutConstraint?
    private var chatInputHeightConstraint: NSLayoutConstraint?
    private var chatInputContainerHeightConstraint: NSLayoutConstraint?
    private var chatInputBackgroundHeightConstraint: NSLayoutConstraint?
    private var chatKeyboardHeight: CGFloat = 0
    private var chatBottomDefaultOffset: CGFloat = 8
    private var isChatInputMinimized = false
    private var hideInitialAIMessageWhileTyping = false
    private var lastScrollOffsetY: CGFloat = 0
    private let chatInputContainer = UIView()
    private let chatInputField = UITextView()
    private let chatInputPlaceholderLabel = UILabel()
    private let chatSendButton = UIButton(type: .system)
    private let sideMenuButton = UIButton(type: .system)
    private let newChatButton = UIButton(type: .system)
    private let sideMenuOverlayView = UIView()
    private let sideMenuContainerView = UIView()
    private let sideMenuScrollView = UIScrollView()
    private let sideMenuContentStack = UIStackView()
    private let sideMenuPrimaryItemsStack = UIStackView()
    private let sideMenuThreadsStack = UIStackView()
    private var isSideMenuOpen = false
    private var sideMenuShiftX: CGFloat = 0
    private let sideMenuWidth: CGFloat = 280
    private let sideMenuItemTextLeadingInset: CGFloat = 18
    private let headerTextYOffset: CGFloat = -20
    private let headerTextXOffset: CGFloat = 38

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

    deinit {
        typingAnimationTimer?.invalidate()
        aiStreamingTimer?.invalidate()
        NotificationCenter.default.removeObserver(self)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if isChatInterfaceEnabled {
            navigationController?.setNavigationBarHidden(true, animated: false)
            chatInputContainer.isHidden = false
            tabBarController?.tabBar.isHidden = true
            if isSideMenuOpen {
                isSideMenuOpen = false
            }
            sideMenuShiftX = 0
            applyMainContentShift(animated: false)
            updateChatBottomDefaultOffset()
            return
        }

        //checkSubscription()
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

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if isChatInterfaceEnabled {
            if isSideMenuOpen {
                closeSideMenu()
            }
            chatInputContainer.isHidden = true
            tabBarController?.tabBar.isHidden = false
        }
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        if isChatInterfaceEnabled, !chatInputContainer.isHidden {
            updateChatBottomDefaultOffset()
            updateChatInputHeight(animated: false)
            if !(chatInputField.isFirstResponder) {
                chatInputBottomConstraint?.constant = -chatBottomDefaultOffset
            }
        }
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
        if isChatInterfaceEnabled {
            tableView.dataSource = self
            tableView.delegate = self
            setupChatInterface()
            registerForChatKeyboardNotifications()
            appendMessage("Ask anything about Zambian case law or legislation to get started.", isUser: false)
            return
        }

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
        
    }

    /*
    func checkSubscription(){
        Subscription.checkSubscription(completionHandler:{(res,error) in
            print(res)
            if res == "active" {
                print("subscription is active")
            } else if res == "inactive" {
                self.performSegue(withIdentifier: "subscriptionRenewal", sender: self)
            } else if res == "register" {
                //todo add redirection to registration
                print("please register")
            }
        })
    }
    */
    
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

        let blurEffect = UIBlurEffect(style: .dark)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame=layer.frame
        bgView.image = screenshot

        bgView.addSubview(blurEffectView)
        return bgView
    }
    
    func configureUIControls () { //for cutomising controls on the UI
        
        tableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        
        // 1. UITableView Customisation
        tableView.separatorStyle = .none //remove separators before search
        tableView.tableFooterView = UIView(frame: CGRect.zero) //remove trailing separators after content
        tableView.backgroundColor = UIColor.white
        
       
        
    }

    private func setupChatInterface() {
        apptorneyLabel.text = "Apptorney AI"
        apptorneyLabel.font = UIFont.systemFont(ofSize: 20, weight: .regular)
        dateLabel.isHidden = true
        separatorBar.isHidden = true
        userIcon.isHidden = true
        apptorneyLabel.transform = CGAffineTransform(translationX: headerTextXOffset, y: headerTextYOffset)
        dateLabel.transform = .identity
        userIcon.transform = .identity
        configureLiquidGlassTabBar()

        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ChatCell")
        tableView.separatorStyle = .none
        tableView.backgroundColor = UIColor.white
        tableView.keyboardDismissMode = .interactive
        tableView.estimatedRowHeight = 120
        tableView.rowHeight = UITableView.automaticDimension
        tableView.sectionHeaderHeight = 0
        tableView.sectionFooterHeight = 0
        if #available(iOS 15.0, *) {
            tableView.sectionHeaderTopPadding = 0
        }

        setupSideMenuUI()
        setupChatInputBar()
        fetchChatThreads()
    }

    private func setupSideMenuUI() {
        sideMenuButton.translatesAutoresizingMaskIntoConstraints = false
        if #available(iOS 13.0, *) {
            sideMenuButton.setImage(UIImage(systemName: "line.3.horizontal"), for: .normal)
        } else {
            sideMenuButton.setTitle("≡", for: .normal)
        }
        sideMenuButton.tintColor = UIColor.black
        sideMenuButton.titleLabel?.font = UIFont.systemFont(ofSize: 24, weight: .regular)
        sideMenuButton.addTarget(self, action: #selector(toggleSideMenu), for: .touchUpInside)

        if sideMenuButton.superview == nil {
            view.addSubview(sideMenuButton)
            NSLayoutConstraint.activate([
                sideMenuButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 12),
                sideMenuButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 2),
                sideMenuButton.widthAnchor.constraint(equalToConstant: 36),
                sideMenuButton.heightAnchor.constraint(equalToConstant: 36)
            ])
        }

        newChatButton.translatesAutoresizingMaskIntoConstraints = false
        if #available(iOS 13.0, *) {
            newChatButton.setImage(UIImage(systemName: "square.and.pencil"), for: .normal)
        } else {
            newChatButton.setTitle("+", for: .normal)
        }
        newChatButton.tintColor = UIColor.black
        newChatButton.titleLabel?.font = UIFont.systemFont(ofSize: 24, weight: .regular)
        newChatButton.addTarget(self, action: #selector(startNewChat), for: .touchUpInside)

        if newChatButton.superview == nil {
            view.addSubview(newChatButton)
            NSLayoutConstraint.activate([
                newChatButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
                newChatButton.topAnchor.constraint(equalTo: sideMenuButton.topAnchor),
                newChatButton.widthAnchor.constraint(equalToConstant: 36),
                newChatButton.heightAnchor.constraint(equalToConstant: 36)
            ])
        }

        guard sideMenuOverlayView.superview == nil else { return }

        sideMenuOverlayView.translatesAutoresizingMaskIntoConstraints = false
        sideMenuOverlayView.backgroundColor = UIColor.black.withAlphaComponent(0.18)
        sideMenuOverlayView.alpha = 0
        sideMenuOverlayView.isUserInteractionEnabled = false
        let overlayTap = UITapGestureRecognizer(target: self, action: #selector(closeSideMenu))
        sideMenuOverlayView.addGestureRecognizer(overlayTap)

        sideMenuContainerView.translatesAutoresizingMaskIntoConstraints = false
        sideMenuContainerView.backgroundColor = UIColor(white: 0.96, alpha: 1.0)
        sideMenuContainerView.clipsToBounds = true

        sideMenuScrollView.translatesAutoresizingMaskIntoConstraints = false
        sideMenuScrollView.showsVerticalScrollIndicator = false
        sideMenuScrollView.alwaysBounceVertical = true

        sideMenuContentStack.translatesAutoresizingMaskIntoConstraints = false
        sideMenuContentStack.axis = .vertical
        sideMenuContentStack.spacing = 8
        sideMenuContentStack.alignment = .fill
        sideMenuContentStack.distribution = .fill

        sideMenuPrimaryItemsStack.translatesAutoresizingMaskIntoConstraints = false
        sideMenuPrimaryItemsStack.axis = .vertical
        sideMenuPrimaryItemsStack.spacing = 8
        sideMenuPrimaryItemsStack.alignment = .fill
        sideMenuPrimaryItemsStack.distribution = .fill

        sideMenuThreadsStack.translatesAutoresizingMaskIntoConstraints = false
        sideMenuThreadsStack.axis = .vertical
        sideMenuThreadsStack.spacing = 2
        sideMenuThreadsStack.alignment = .fill
        sideMenuThreadsStack.distribution = .fill

        let items: [(String, String, Int)] = [
            ("home-tab-selected", "Home", 0),
            ("cases-gavel", "Cases", 1),
            ("legislations-books", "Legislations", 2),
            ("info", "Info", 3)
        ]
        for (iconName, title, index) in items {
            let button = UIButton(type: .system)
            button.setTitle(title, for: .normal)
            button.setTitleColor(.black, for: .normal)
            button.contentHorizontalAlignment = .left
            button.titleLabel?.font = UIFont.systemFont(ofSize: 15, weight: .regular)
            button.setImage(UIImage(named: iconName), for: .normal)
            button.tintColor = .black
            button.imageView?.contentMode = .scaleAspectFit
            button.semanticContentAttribute = .forceLeftToRight
            button.contentEdgeInsets = UIEdgeInsets(top: 0, left: 18, bottom: 0, right: 8)
            button.imageEdgeInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 10)
            button.titleEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 0, right: 0)
            button.tag = index
            button.heightAnchor.constraint(equalToConstant: 44).isActive = true
            button.addTarget(self, action: #selector(sideMenuItemTapped(_:)), for: .touchUpInside)
            sideMenuPrimaryItemsStack.addArrangedSubview(button)
        }

        view.addSubview(sideMenuContainerView)
        view.addSubview(sideMenuOverlayView)
        sideMenuContainerView.addSubview(sideMenuScrollView)
        sideMenuScrollView.addSubview(sideMenuContentStack)
        sideMenuContentStack.addArrangedSubview(sideMenuPrimaryItemsStack)
        sideMenuContentStack.setCustomSpacing(12, after: sideMenuPrimaryItemsStack)
        sideMenuContentStack.addArrangedSubview(sideMenuThreadsStack)

        NSLayoutConstraint.activate([
            sideMenuContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            sideMenuContainerView.topAnchor.constraint(equalTo: view.topAnchor),
            sideMenuContainerView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            sideMenuContainerView.widthAnchor.constraint(equalToConstant: sideMenuWidth),

            sideMenuOverlayView.leadingAnchor.constraint(equalTo: sideMenuContainerView.trailingAnchor),
            sideMenuOverlayView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            sideMenuOverlayView.topAnchor.constraint(equalTo: view.topAnchor),
            sideMenuOverlayView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            sideMenuScrollView.leadingAnchor.constraint(equalTo: sideMenuContainerView.leadingAnchor),
            sideMenuScrollView.trailingAnchor.constraint(equalTo: sideMenuContainerView.trailingAnchor),
            sideMenuScrollView.topAnchor.constraint(equalTo: sideMenuContainerView.safeAreaLayoutGuide.topAnchor),
            sideMenuScrollView.bottomAnchor.constraint(equalTo: sideMenuContainerView.bottomAnchor),

            sideMenuContentStack.leadingAnchor.constraint(equalTo: sideMenuScrollView.contentLayoutGuide.leadingAnchor, constant: 6),
            sideMenuContentStack.trailingAnchor.constraint(equalTo: sideMenuScrollView.contentLayoutGuide.trailingAnchor, constant: -6),
            sideMenuContentStack.topAnchor.constraint(equalTo: sideMenuScrollView.contentLayoutGuide.topAnchor, constant: 26),
            sideMenuContentStack.bottomAnchor.constraint(equalTo: sideMenuScrollView.contentLayoutGuide.bottomAnchor, constant: -16),
            sideMenuContentStack.widthAnchor.constraint(equalTo: sideMenuScrollView.frameLayoutGuide.widthAnchor, constant: -12)
        ])

        renderSideMenuThreads()
        sideMenuContainerView.transform = CGAffineTransform(translationX: -sideMenuWidth, y: 0)
        sideMenuOverlayView.alpha = 0
        sideMenuOverlayView.isUserInteractionEnabled = false
    }

    @objc private func toggleSideMenu() {
        isSideMenuOpen.toggle()
        if isSideMenuOpen {
            fetchChatThreads()
        }
        sideMenuShiftX = isSideMenuOpen ? sideMenuWidth : 0
        applyMainContentShift(animated: true)
    }

    private func applyMainContentShift(animated: Bool) {
        let contentX = sideMenuShiftX
        let sideMenuX = isSideMenuOpen ? 0 : -sideMenuWidth

        let updates = {
            self.sideMenuContainerView.transform = CGAffineTransform(translationX: sideMenuX, y: 0)
            self.tableView.transform = CGAffineTransform(translationX: contentX, y: 0)
            self.apptorneyLabel.transform = CGAffineTransform(translationX: contentX + self.headerTextXOffset, y: self.headerTextYOffset)
            self.dateLabel.transform = .identity
            self.userIcon.transform = .identity
            self.sideMenuButton.transform = CGAffineTransform(translationX: contentX, y: 0)
            self.newChatButton.transform = CGAffineTransform(translationX: contentX, y: 0)
            self.chatInputContainer.transform = self.chatInputTransformForCurrentState()
            self.sideMenuOverlayView.alpha = self.isSideMenuOpen ? 1 : 0
            self.sideMenuOverlayView.isUserInteractionEnabled = self.isSideMenuOpen
            self.view.layoutIfNeeded()
        }

        if animated {
            UIView.animate(withDuration: 0.22, delay: 0, options: [.curveEaseInOut], animations: updates)
        } else {
            updates()
        }
    }

    private func chatInputTransformForCurrentState() -> CGAffineTransform {
        var transform = CGAffineTransform(translationX: sideMenuShiftX, y: 0)
        if isChatInputMinimized {
            transform = transform.translatedBy(x: 0, y: 12).scaledBy(x: 0.97, y: 0.97)
        }
        return transform
    }

    @objc private func closeSideMenu() {
        guard isSideMenuOpen else { return }
        isSideMenuOpen = false
        sideMenuShiftX = 0
        applyMainContentShift(animated: true)
    }

    @objc private func sideMenuItemTapped(_ sender: UIButton) {
        let index = sender.tag
        closeSideMenu()
        if index == 0 {
            tabBarController?.tabBar.isHidden = true
            return
        }
        tabBarController?.tabBar.isHidden = false
        tabBarController?.selectedIndex = index
    }

    @objc private func startNewChat() {
        stopAIResponseStreaming()
        if isSideMenuOpen {
            closeSideMenu()
        }
        currentThreadId = nil
        renderSideMenuThreads()
        isAwaitingAIResponse = false
        isStreamingAIResponse = false
        chatSendButton.alpha = 1.0
        stopTypingAnimation()
        chatMessages.removeAll()
        hideInitialAIMessageWhileTyping = false
        chatInputField.text = ""
        appendMessage("Ask anything about Zambian case law or legislation to get started.", isUser: false)
        updateChatInputHeight(animated: false)
    }

    private func sideMenuThreadTitle(for thread: ChatThreadSummary) -> String {
        let title = thread.title.trimmingCharacters(in: .whitespacesAndNewlines)
        if !title.isEmpty && title.lowercased() != "new chat" {
            return title
        }
        let fallback = thread.lastQuestion.trimmingCharacters(in: .whitespacesAndNewlines)
        return fallback.isEmpty ? "New chat" : fallback
    }

    private func indentedSideMenuText(_ text: String, font: UIFont, color: UIColor) -> NSAttributedString {
        let paragraph = NSMutableParagraphStyle()
        paragraph.firstLineHeadIndent = sideMenuItemTextLeadingInset
        paragraph.headIndent = sideMenuItemTextLeadingInset
        paragraph.lineBreakMode = .byTruncatingTail
        return NSAttributedString(
            string: text,
            attributes: [
                .font: font,
                .foregroundColor: color,
                .paragraphStyle: paragraph
            ]
        )
    }

    private func renderSideMenuThreads() {
        sideMenuThreadsStack.arrangedSubviews.forEach {
            sideMenuThreadsStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }

        let statusLabel: UILabel = {
            let label = UILabel()
            label.numberOfLines = 1
            label.font = UIFont.systemFont(ofSize: 13, weight: .regular)
            label.textColor = UIColor(white: 0.42, alpha: 1.0)
            return label
        }()

        if isLoadingChatThreads {
            statusLabel.attributedText = indentedSideMenuText(
                "Loading conversations...",
                font: UIFont.systemFont(ofSize: 15, weight: .regular),
                color: UIColor(white: 0.42, alpha: 1.0)
            )
            statusLabel.textAlignment = .left
            sideMenuThreadsStack.addArrangedSubview(statusLabel)
            return
        }

        if chatThreads.isEmpty {
            statusLabel.attributedText = indentedSideMenuText(
                "No conversations yet",
                font: UIFont.systemFont(ofSize: 15, weight: .regular),
                color: UIColor(white: 0.42, alpha: 1.0)
            )
            statusLabel.textAlignment = .left
            sideMenuThreadsStack.addArrangedSubview(statusLabel)
            return
        }

        for (index, thread) in chatThreads.enumerated() {
            let button = UIButton(type: .system)
            button.setTitle(sideMenuThreadTitle(for: thread), for: .normal)
            button.setTitleColor(.black, for: .normal)
            button.contentHorizontalAlignment = .left
            button.titleLabel?.font = UIFont.systemFont(ofSize: 15, weight: .regular)
            button.titleLabel?.lineBreakMode = .byTruncatingTail
            button.titleLabel?.numberOfLines = 1
            button.contentEdgeInsets = UIEdgeInsets(top: 8, left: sideMenuItemTextLeadingInset, bottom: 8, right: 8)
            button.tag = index
            button.layer.cornerRadius = 10
            button.backgroundColor = (thread.id == currentThreadId) ? UIColor.black.withAlphaComponent(0.08) : UIColor.clear
            button.addTarget(self, action: #selector(sideMenuThreadTapped(_:)), for: .touchUpInside)
            sideMenuThreadsStack.addArrangedSubview(button)
        }
    }

    private func authorizationTokenCandidate() -> String? {
        func normalizedToken(_ value: Any?) -> String {
            guard let value = value else { return "" }
            if let text = value as? String {
                return text.trimmingCharacters(in: .whitespacesAndNewlines)
            }
            if let number = value as? NSNumber {
                return number.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            }
            return "\(value)".trimmingCharacters(in: .whitespacesAndNewlines)
        }
        func isPlausibleToken(_ token: String) -> Bool {
            let trimmed = token.trimmingCharacters(in: .whitespacesAndNewlines)
            if trimmed.count < 12 { return false }
            if trimmed.contains("{") || trimmed.contains("}") { return false }
            if trimmed.contains(" ") || trimmed.contains("\n") || trimmed.contains("\t") { return false }
            if trimmed.lowercased().hasPrefix("optional(") { return false }
            return true
        }

        let keys = [APIService.authTokenStorageKey, "access_token", "accessToken", "token", "id"]
        for key in keys {
            let value = normalizedToken(defaults.object(forKey: key))
            if isPlausibleToken(value) {
                return value
            }
        }

        if let cookies = HTTPCookieStorage.shared.cookies {
            if let cookie = cookies.first(where: { $0.name.lowercased() == "access_token" }) {
                let token = normalizedToken(cookie.value)
                if isPlausibleToken(token) {
                    defaults.set(token, forKey: APIService.authTokenStorageKey)
                    defaults.set(token, forKey: "access_token")
                    defaults.synchronize()
                    return token
                }
            }
        }
        return nil
    }

    private func buildAPIRequest(url: URL, httpMethod: String = "GET") -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        request.timeoutInterval = 60
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("4449615d-b5b2-4e16-a059-f6bda4486953", forHTTPHeaderField: "X-IBM-Client-ID")
        request.setValue("81ed3948-6ca5-4936-be0b-5db9aec1107b", forHTTPHeaderField: "X-IBM-Client-Secret")
        if let token = authorizationTokenCandidate() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            request.setValue(token, forHTTPHeaderField: "X-Access-Token")
        }
        return request
    }

    private func parseThreadSummaries(from result: Any?) -> [ChatThreadSummary] {
        func decodeThread(dict: [String: Any]) -> ChatThreadSummary? {
            guard let id = dict["id"] as? String else { return nil }
            let title = (dict["title"] as? String) ?? "New chat"
            let updatedAt = (dict["updatedAt"] as? String) ?? ""
            let lastQuestion = (dict["lastQuestion"] as? String) ?? ""
            return ChatThreadSummary(id: id, title: title, updatedAt: updatedAt, lastQuestion: lastQuestion)
        }

        if let dict = result as? [String: Any] {
            let dataDict = (dict["data"] as? [String: Any]) ?? dict
            var threadsArray = (dataDict["threads"] as? [[String: Any]]) ?? []
            if threadsArray.isEmpty,
               let threadsObject = dataDict["threads"] as? [String: Any] {
                threadsArray = (threadsObject["threads"] as? [[String: Any]]) ?? []
            }
            return threadsArray.compactMap(decodeThread)
        }

        if let array = result as? [[String: Any]] {
            return array.compactMap(decodeThread)
        }

        return []
    }

    private func parseThreadHistory(from result: Any?) -> [ChatMessage]? {
        guard let dict = result as? [String: Any] else { return nil }
        var dataDict = (dict["data"] as? [String: Any]) ?? dict
        if let threadDict = dataDict["thread"] as? [String: Any] {
            dataDict = threadDict
        }
        let history = (dataDict["history"] as? [[String: Any]]) ?? []
        let messages = history.compactMap { item -> ChatMessage? in
            guard let role = item["role"] as? String,
                  let content = item["content"] as? String else { return nil }
            let trimmed = content.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty else { return nil }
            return ChatMessage(text: trimmed, isUser: role.lowercased() == "user", references: [])
        }
        return messages
    }

    private func fetchChatThreads() {
        guard var components = URLComponents(string: APIService.urlBase + chatThreadsEndpoint) else { return }
        var queryItems: [URLQueryItem] = [URLQueryItem(name: "limit", value: "30")]
        if let token = authorizationTokenCandidate() {
            queryItems.append(URLQueryItem(name: "access_token", value: token))
        }
        components.queryItems = queryItems
        guard let url = components.url else { return }

        isLoadingChatThreads = true
        renderSideMenuThreads()

        let request = buildAPIRequest(url: url)
        URLSession.shared.dataTask(with: request) { data, _, _ in
            var threads: [ChatThreadSummary] = []
            if let data = data, let jsonObject = try? JSONSerialization.jsonObject(with: data, options: []) {
                threads = self.parseThreadSummaries(from: jsonObject)
            }

            DispatchQueue.main.async {
                self.isLoadingChatThreads = false
                self.chatThreads = threads
                self.renderSideMenuThreads()
            }
        }.resume()
    }

    @objc private func sideMenuThreadTapped(_ sender: UIButton) {
        let index = sender.tag
        guard index >= 0, index < chatThreads.count else { return }
        loadChatThread(id: chatThreads[index].id)
    }

    private func loadChatThread(id threadId: String) {
        guard var components = URLComponents(string: APIService.urlBase + chatThreadsEndpoint + "/" + threadId) else { return }
        var queryItems: [URLQueryItem] = []
        if let token = authorizationTokenCandidate() {
            queryItems.append(URLQueryItem(name: "access_token", value: token))
        }
        components.queryItems = queryItems.isEmpty ? nil : queryItems
        guard let url = components.url else { return }

        let request = buildAPIRequest(url: url)
        URLSession.shared.dataTask(with: request) { data, _, _ in
            guard let data = data,
                  let jsonObject = try? JSONSerialization.jsonObject(with: data, options: []),
                  let messages = self.parseThreadHistory(from: jsonObject) else { return }

            DispatchQueue.main.async {
                self.currentThreadId = threadId
                self.stopAIResponseStreaming()
                self.isAwaitingAIResponse = false
                self.isStreamingAIResponse = false
                self.chatSendButton.alpha = 1.0
                self.stopTypingAnimation()
                self.hideInitialAIMessageWhileTyping = false
                self.chatMessages = messages.isEmpty
                    ? [ChatMessage(text: "Ask anything about Zambian case law or legislation to get started.", isUser: false, references: [])]
                    : messages
                self.tableView.reloadData()
                self.scrollChatToBottom(animated: false)
                self.renderSideMenuThreads()
                self.closeSideMenu()
            }
        }.resume()
    }

    private func setupChatInputBar() {
        chatInputContainer.removeFromSuperview()
        chatInputContainer.translatesAutoresizingMaskIntoConstraints = false
        chatInputContainer.backgroundColor = UIColor.clear
        let hostView: UIView = self.view
        hostView.addSubview(chatInputContainer)

        let blurStyle: UIBlurEffect.Style
        if #available(iOS 13.0, *) {
            blurStyle = .systemChromeMaterial
        } else {
            blurStyle = .light
        }
        let inputBackground = UIVisualEffectView(effect: UIBlurEffect(style: blurStyle))
        inputBackground.translatesAutoresizingMaskIntoConstraints = false
        inputBackground.layer.cornerRadius = 24
        inputBackground.clipsToBounds = true

        chatInputField.translatesAutoresizingMaskIntoConstraints = false
        chatInputField.font = UIFont.systemFont(ofSize: 20, weight: .regular)
        chatInputField.textContainerInset = UIEdgeInsets(top: 8, left: 0, bottom: 8, right: 0)
        chatInputField.backgroundColor = .clear
        chatInputField.isScrollEnabled = false
        chatInputField.delegate = self

        chatInputPlaceholderLabel.translatesAutoresizingMaskIntoConstraints = false
        chatInputPlaceholderLabel.text = "Ask anything"
        chatInputPlaceholderLabel.font = UIFont.systemFont(ofSize: 20, weight: .regular)
        chatInputPlaceholderLabel.textColor = UIColor.gray.withAlphaComponent(0.9)

        chatSendButton.translatesAutoresizingMaskIntoConstraints = false
        if #available(iOS 13.0, *) {
            chatSendButton.setImage(UIImage(systemName: "arrow.up"), for: .normal)
        } else {
            chatSendButton.setImage(UIImage(named: "right-arrow-2"), for: .normal)
        }
        chatSendButton.backgroundColor = UIColor.black
        chatSendButton.tintColor = UIColor.white
        chatSendButton.layer.cornerRadius = 18
        chatSendButton.clipsToBounds = true
        chatSendButton.addTarget(self, action: #selector(sendChatMessage), for: .touchUpInside)
        chatInputContainer.addSubview(inputBackground)
        inputBackground.contentView.addSubview(chatInputField)
        inputBackground.contentView.addSubview(chatInputPlaceholderLabel)
        inputBackground.contentView.addSubview(chatSendButton)

        updateChatBottomDefaultOffset()
        chatInputBottomConstraint = chatInputContainer.bottomAnchor.constraint(equalTo: hostView.safeAreaLayoutGuide.bottomAnchor, constant: -chatBottomDefaultOffset)
        let containerHeightConstraint = chatInputContainer.heightAnchor.constraint(equalToConstant: 56)
        chatInputContainerHeightConstraint = containerHeightConstraint
        chatInputHeightConstraint = containerHeightConstraint
        let inputBackgroundHeightConstraint = inputBackground.heightAnchor.constraint(equalToConstant: 48)
        chatInputBackgroundHeightConstraint = inputBackgroundHeightConstraint

        NSLayoutConstraint.activate([
            chatInputContainer.leadingAnchor.constraint(equalTo: hostView.leadingAnchor, constant: 16),
            chatInputContainer.trailingAnchor.constraint(equalTo: hostView.trailingAnchor, constant: -16),
            chatInputBottomConstraint!,
            containerHeightConstraint,

            inputBackground.leadingAnchor.constraint(equalTo: chatInputContainer.leadingAnchor),
            inputBackground.trailingAnchor.constraint(equalTo: chatInputContainer.trailingAnchor),
            inputBackground.centerYAnchor.constraint(equalTo: chatInputContainer.centerYAnchor),
            inputBackgroundHeightConstraint,

            chatInputField.leadingAnchor.constraint(equalTo: inputBackground.contentView.leadingAnchor, constant: 16),
            chatInputField.trailingAnchor.constraint(equalTo: chatSendButton.leadingAnchor, constant: -10),
            chatInputField.topAnchor.constraint(equalTo: inputBackground.contentView.topAnchor, constant: 4),
            chatInputField.bottomAnchor.constraint(equalTo: inputBackground.contentView.bottomAnchor, constant: -4),

            chatInputPlaceholderLabel.leadingAnchor.constraint(equalTo: chatInputField.leadingAnchor, constant: 4),
            chatInputPlaceholderLabel.trailingAnchor.constraint(lessThanOrEqualTo: chatInputField.trailingAnchor),
            chatInputPlaceholderLabel.centerYAnchor.constraint(equalTo: inputBackground.contentView.centerYAnchor),

            chatSendButton.trailingAnchor.constraint(equalTo: inputBackground.contentView.trailingAnchor, constant: -6),
            chatSendButton.centerYAnchor.constraint(equalTo: inputBackground.contentView.centerYAnchor),
            chatSendButton.widthAnchor.constraint(equalToConstant: 36),
            chatSendButton.heightAnchor.constraint(equalToConstant: 36)
        ])

        updateChatInputHeight(animated: false)
        refreshChatInsets()
    }

    private func updateChatInputHeight(animated: Bool) {
        let horizontalPadding: CGFloat = 16 + 16 + 36 + 10 + 6
        let targetWidth = max(100, chatInputContainer.bounds.width - horizontalPadding)
        let measuredHeight = chatInputField.sizeThatFits(CGSize(width: targetWidth, height: CGFloat.greatestFiniteMagnitude)).height
        let clampedTextHeight = min(max(measuredHeight, 34), 104)
        let inputBackgroundHeight = clampedTextHeight + 14

        chatInputField.isScrollEnabled = measuredHeight > 104
        chatInputBackgroundHeightConstraint?.constant = max(48, inputBackgroundHeight)
        chatInputContainerHeightConstraint?.constant = max(56, inputBackgroundHeight + 8)
        chatInputHeightConstraint?.constant = max(56, inputBackgroundHeight + 8)

        let updates = {
            let text = self.chatInputField.text ?? ""
            self.chatInputPlaceholderLabel.isHidden = !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            self.refreshChatInsets()
            self.chatInputContainer.superview?.layoutIfNeeded()
            self.view.layoutIfNeeded()
        }

        if animated {
            UIView.animate(withDuration: 0.16, delay: 0, options: [.curveEaseInOut], animations: updates)
        } else {
            updates()
        }
    }

    private func refreshChatInsets() {
        let composerHeight = chatInputContainerHeightConstraint?.constant ?? 56
        let extraPadding: CGFloat = 24
        let bottomInset = (chatKeyboardHeight > 0 ? chatKeyboardHeight : 0) + composerHeight + extraPadding
        tableView.contentInset.bottom = bottomInset
        tableView.scrollIndicatorInsets.bottom = bottomInset
    }

    private func updateChatBottomDefaultOffset() {
        guard let tabBar = tabBarController?.tabBar else {
            chatBottomDefaultOffset = 8
            return
        }
        chatBottomDefaultOffset = tabBar.isHidden ? 8 : (tabBar.frame.height + 8)
    }

    private func configureLiquidGlassTabBar() {
        guard let tabBar = tabBarController?.tabBar else { return }

        tabBar.isTranslucent = true
        tabBar.backgroundImage = UIImage()
        tabBar.shadowImage = UIImage()

        if #available(iOS 13.0, *) {
            let appearance = UITabBarAppearance()
            appearance.configureWithTransparentBackground()
            appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
            appearance.backgroundColor = UIColor.white.withAlphaComponent(0.35)
            appearance.shadowColor = .clear
            tabBar.standardAppearance = appearance
            if #available(iOS 15.0, *) {
                tabBar.scrollEdgeAppearance = appearance
            }
        }

        tabBar.layer.masksToBounds = true
        tabBar.layer.cornerRadius = 24
        if #available(iOS 13.0, *) {
            tabBar.layer.cornerCurve = .continuous
        }
    }

    private func setChatInputMinimized(_ minimized: Bool, animated: Bool) {
        guard minimized != isChatInputMinimized else { return }
        isChatInputMinimized = minimized

        let updates = {
            self.chatInputContainer.alpha = minimized ? 0.82 : 1.0
            self.chatInputContainer.transform = self.chatInputTransformForCurrentState()
            if minimized {
                self.chatInputContainerHeightConstraint?.constant = 56
            } else {
                self.updateChatInputHeight(animated: false)
            }
            self.chatInputField.alpha = minimized ? 0.75 : 1.0
            self.chatInputContainer.superview?.layoutIfNeeded()
        }

        if animated {
            UIView.animate(withDuration: 0.2, delay: 0, options: [.curveEaseInOut], animations: updates)
        } else {
            updates()
        }
    }

    @objc private func sendChatMessage() {
        guard !isAwaitingAIResponse && !isStreamingAIResponse else { return }
        let prompt = chatInputField.text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !prompt.isEmpty else { return }

        if chatMessages.count == 1, chatMessages.first?.isUser == false {
            chatMessages.removeFirst()
        }
        hideInitialAIMessageWhileTyping = false
        appendMessage(prompt, isUser: true)
        chatInputField.text = ""
        updateChatInputHeight(animated: true)
        isAwaitingAIResponse = true
        chatSendButton.alpha = 0.5
        startTypingAnimation()
        tableView.reloadData()
        scrollChatToBottom(animated: false)
        requestAskAI(prompt: prompt)
    }

    private func requestAskAI(prompt: String) {
        let compactPrompt = prompt.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !compactPrompt.isEmpty else {
            isAwaitingAIResponse = false
            chatSendButton.alpha = 1.0
            stopTypingAnimation()
            return
        }

        guard var components = URLComponents(string: APIService.urlBase + askAIEndpoint) else {
            isAwaitingAIResponse = false
            chatSendButton.alpha = 1.0
            stopTypingAnimation()
            appendMessage("Sorry, I couldn’t get a response right now. Please try again.", isUser: false)
            return
        }
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "question", value: compactPrompt),
            URLQueryItem(name: "includeCases", value: "true"),
            URLQueryItem(name: "includeLegislations", value: "true")
        ]
        if let currentThreadId = currentThreadId, !currentThreadId.isEmpty {
            queryItems.append(URLQueryItem(name: "threadId", value: currentThreadId))
        }
        if let token = authorizationTokenCandidate() {
            queryItems.append(URLQueryItem(name: "access_token", value: token))
        }
        components.queryItems = queryItems
        guard let url = components.url else {
            isAwaitingAIResponse = false
            chatSendButton.alpha = 1.0
            stopTypingAnimation()
            appendMessage("Sorry, I couldn’t get a response right now. Please try again.", isUser: false)
            return
        }

        let request = buildAPIRequest(url: url, httpMethod: "GET")
        URLSession.shared.dataTask(with: request) { data, response, error in
            var answer: String?
            var references: [ChatReference] = []
            var threadIdFromResponse: String?
            var apiErrorMessage: String?
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0

            if let data = data {
                let jsonObject = try? JSONSerialization.jsonObject(with: data, options: [])
                if let parsed = self.parseAskAIResponse(jsonObject) {
                    answer = parsed.answer
                    references = parsed.references
                }
                threadIdFromResponse = self.parseAskAIThreadId(from: jsonObject)
                apiErrorMessage = self.parseAPIErrorMessage(from: jsonObject)

                if answer == nil,
                   let httpResponse = response as? HTTPURLResponse,
                   (200...299).contains(httpResponse.statusCode),
                   !(httpResponse.mimeType?.lowercased().contains("json") ?? false),
                   let plainText = String(data: data, encoding: .utf8)?.trimmingCharacters(in: .whitespacesAndNewlines),
                   !plainText.isEmpty {
                    answer = plainText
                }
            }

            DispatchQueue.main.async {
                self.isAwaitingAIResponse = false
                self.chatSendButton.alpha = 1.0
                self.stopTypingAnimation()
                if let threadIdFromResponse = threadIdFromResponse, !threadIdFromResponse.isEmpty {
                    self.currentThreadId = threadIdFromResponse
                    self.fetchChatThreads()
                }

                if error == nil, let answer = answer, !answer.isEmpty {
                    self.startStreamingAIResponse(answer, references: references)
                } else {
                    if statusCode == 401 {
                        self.appendMessage("Authentication required. Please log in again.", isUser: false)
                    } else if let apiErrorMessage = apiErrorMessage, !apiErrorMessage.isEmpty {
                        self.appendMessage(apiErrorMessage, isUser: false)
                    } else {
                        self.appendMessage("Sorry, I couldn’t get a response right now. Please try again.", isUser: false)
                    }
                }
            }
        }.resume()
    }

    private func parseAskAIResponse(_ result: Any?) -> (answer: String, references: [ChatReference])? {
        guard let result = result else { return nil }

        if let text = result as? String, !text.isEmpty {
            return (text, [])
        }

        if let dict = result as? [String: Any] {
            let dataDict = dict["data"] as? [String: Any]
            let keys = ["answer", "response", "message", "text", "output"]
            var extractedText: String?

            for key in keys {
                if let value = dict[key] as? String, !value.isEmpty {
                    extractedText = value
                    break
                }
            }

            if extractedText == nil, let data = dataDict {
                for key in keys {
                    if let value = data[key] as? String, !value.isEmpty {
                        extractedText = value
                        break
                    }
                }
            }

            guard let answer = extractedText, !answer.isEmpty else { return nil }

            let sourceDicts = (dataDict?["sources"] as? [[String: Any]]) ?? (dict["sources"] as? [[String: Any]]) ?? []
            let references: [ChatReference] = sourceDicts.compactMap { item in
                guard let source = item["source"] as? String,
                      let id = item["id"] as? String,
                      let type = item["type"] as? String else { return nil }
                let title = (item["title"] as? String) ?? source.uppercased()
                return ChatReference(source: source.uppercased(), id: id, type: type.lowercased(), title: title)
            }

            return (answer, references)
        }

        return nil
    }

    private func parseAskAIThreadId(from result: Any?) -> String? {
        guard let dict = result as? [String: Any] else { return nil }
        let dataDict = (dict["data"] as? [String: Any]) ?? dict
        if let thread = dataDict["thread"] as? [String: Any], let threadId = thread["id"] as? String, !threadId.isEmpty {
            return threadId
        }
        return nil
    }

    private func parseAPIErrorMessage(from result: Any?) -> String? {
        guard let dict = result as? [String: Any] else { return nil }
        if let errorDict = dict["error"] as? [String: Any] {
            if let message = errorDict["message"] as? String, !message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                return message
            }
            if let details = errorDict["details"] as? [String: Any], let message = details["message"] as? String, !message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                return message
            }
        }
        if let message = dict["message"] as? String, !message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return message
        }
        return nil
    }

    private func attributedChatText(
        from rawText: String,
        baseFont: UIFont,
        boldFont: UIFont,
        textColor: UIColor,
        alignment: NSTextAlignment,
        lineSpacing: CGFloat = 2,
        paragraphSpacing: CGFloat = 4
    ) -> NSAttributedString {
        var output = ""
        var boldRanges: [NSRange] = []
        var searchStart = rawText.startIndex

        while searchStart < rawText.endIndex {
            guard let openRange = rawText[searchStart...].range(of: "**") else {
                output.append(contentsOf: rawText[searchStart...])
                break
            }

            output.append(contentsOf: rawText[searchStart..<openRange.lowerBound])
            let contentStart = openRange.upperBound

            guard let closeRange = rawText[contentStart...].range(of: "**") else {
                output.append(contentsOf: rawText[openRange.lowerBound...])
                break
            }

            let boldStart = (output as NSString).length
            output.append(contentsOf: rawText[contentStart..<closeRange.lowerBound])
            let boldLength = (output as NSString).length - boldStart
            if boldLength > 0 {
                boldRanges.append(NSRange(location: boldStart, length: boldLength))
            }

            searchStart = closeRange.upperBound
        }

        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = alignment
        paragraph.lineSpacing = lineSpacing
        paragraph.paragraphSpacing = paragraphSpacing
        paragraph.paragraphSpacingBefore = 2

        let attributed = NSMutableAttributedString(
            string: output,
            attributes: [
                .font: baseFont,
                .foregroundColor: textColor,
                .paragraphStyle: paragraph
            ]
        )

        for range in boldRanges {
            attributed.addAttribute(.font, value: boldFont, range: range)
        }

        return attributed
    }

    private func attributedAIMessageText(for message: ChatMessage) -> NSAttributedString {
        let body = NSMutableAttributedString(
            attributedString: attributedChatText(
                from: message.text,
                baseFont: UIFont.systemFont(ofSize: 17, weight: .light),
                boldFont: UIFont.systemFont(ofSize: 17, weight: .semibold),
                textColor: UIColor.black,
                alignment: .left,
                lineSpacing: 2,
                paragraphSpacing: 4
            )
        )

        guard !message.references.isEmpty else { return body }

        let sourceMap = Dictionary(uniqueKeysWithValues: message.references.map { ($0.source.uppercased(), $0) })
        let sourceTagRegex = try? NSRegularExpression(pattern: "\\[S(\\d+)\\]", options: [.caseInsensitive])
        let initialText = body.string as NSString
        let matches = sourceTagRegex?.matches(in: body.string, options: [], range: NSRange(location: 0, length: initialText.length)) ?? []
        for match in matches.reversed() {
            guard match.numberOfRanges >= 2 else { continue }
            let number = initialText.substring(with: match.range(at: 1))
            let token = "S\(number)".uppercased()
            guard sourceMap[token] != nil else { continue }
            let superscript = circularSuperscriptReference(number: number, token: token)
            body.replaceCharacters(in: match.range, with: superscript)
        }

        let refsHeaderFont = UIFont.systemFont(ofSize: 17, weight: .bold)
        let refsTitleFont = UIFont.systemFont(ofSize: 17, weight: .regular)

        let refsHeaderParagraph = NSMutableParagraphStyle()
        refsHeaderParagraph.lineSpacing = 1
        refsHeaderParagraph.paragraphSpacing = 6
        let refsItemParagraph = NSMutableParagraphStyle()
        refsItemParagraph.lineSpacing = 1
        refsItemParagraph.paragraphSpacing = 2
        refsItemParagraph.headIndent = 0

        body.append(NSAttributedString(
            string: "\n\nReferences\n\n",
            attributes: [
                .font: refsHeaderFont,
                .foregroundColor: UIColor.black,
                .paragraphStyle: refsHeaderParagraph
            ]
        ))
        for (index, reference) in message.references.enumerated() {
            let token = reference.source.uppercased()
            let title = titleCasedReferenceTitle(reference.title)
            let line = NSMutableAttributedString(
                string: "\(index + 1). \(title)\n",
                attributes: [
                    .font: refsTitleFont,
                    .foregroundColor: UIColor.black,
                    .paragraphStyle: refsItemParagraph
                ]
            )
            line.addAttribute(.link, value: "apptorney-ref://\(token)", range: NSRange(location: 0, length: line.length))
            let lineRange = NSRange(location: body.length, length: line.length)
            body.append(line)
            body.addAttribute(.paragraphStyle, value: refsItemParagraph, range: lineRange)
        }

        return body
    }

    private func circularSuperscriptReference(number: String, token: String) -> NSAttributedString {
        let diameter: CGFloat = 13
        let renderer = UIGraphicsImageRenderer(size: CGSize(width: diameter, height: diameter))
        let image = renderer.image { context in
            let rect = CGRect(x: 0, y: 0, width: diameter, height: diameter)
            UIColor(white: 0.82, alpha: 1.0).setFill()
            context.cgContext.fillEllipse(in: rect)

            let attrs: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 8, weight: .semibold),
                .foregroundColor: UIColor.black
            ]
            let textSize = number.size(withAttributes: attrs)
            let textRect = CGRect(
                x: (diameter - textSize.width) / 2,
                y: (diameter - textSize.height) / 2,
                width: textSize.width,
                height: textSize.height
            )
            number.draw(in: textRect, withAttributes: attrs)
        }

        let attachment = NSTextAttachment()
        attachment.image = image
        attachment.bounds = CGRect(x: 0, y: -2, width: diameter, height: diameter)
        let attributed = NSMutableAttributedString(attachment: attachment)
        attributed.addAttributes(
            [
                .baselineOffset: 7,
                .link: "apptorney-ref://\(token)"
            ],
            range: NSRange(location: 0, length: attributed.length)
        )
        return attributed
    }

    private func titleCasedReferenceTitle(_ title: String) -> String {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return title }
        return trimmed.lowercased().capitalized
    }

    private func chatReference(for source: String) -> ChatReference? {
        let token = source.uppercased()
        for message in chatMessages.reversed() {
            if let reference = message.references.first(where: { $0.source.uppercased() == token }) {
                return reference
            }
        }
        return nil
    }

    private func presentReference(_ reference: ChatReference) {
        if reference.type == "case" {
            let storyboard = UIStoryboard(name: "Case", bundle: nil)
            guard let controller = storyboard.instantiateViewController(withIdentifier: "Case Details") as? CaseDetailsTableViewController else { return }
            let caseInstance = Case()
            caseInstance._id = reference.id
            controller.caseInstance = caseInstance

            let nav = UINavigationController(rootViewController: controller)
            if #available(iOS 13.0, *) {
                controller.navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .close, target: self, action: #selector(dismissPresentedResource))
            } else {
                controller.navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(dismissPresentedResource))
            }
            nav.modalPresentationStyle = .pageSheet
            present(nav, animated: true)
            return
        }

        if reference.type == "legislation" {
            let storyboard = UIStoryboard(name: "Legislation", bundle: nil)
            guard let controller = storyboard.instantiateViewController(withIdentifier: "LegislationDetails") as? LegislationDetailsTableViewController else { return }
            let legislation = Legislation()
            legislation._id = reference.id
            controller.legislationInstance = legislation

            let nav = UINavigationController(rootViewController: controller)
            if #available(iOS 13.0, *) {
                controller.navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .close, target: self, action: #selector(dismissPresentedResource))
            } else {
                controller.navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(dismissPresentedResource))
            }
            nav.modalPresentationStyle = .pageSheet
            present(nav, animated: true)
        }
    }

    @objc private func dismissPresentedResource() {
        presentedViewController?.dismiss(animated: true)
    }

    private func startStreamingAIResponse(_ text: String, references: [ChatReference]) {
        stopAIResponseStreaming()
        isStreamingAIResponse = true
        chatSendButton.alpha = 0.5

        let normalizedText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        pendingStreamingReferences = references
        chatMessages.append(ChatMessage(text: "", isUser: false, references: []))
        streamingMessageIndex = chatMessages.count - 1
        streamingCharacters = Array(normalizedText)
        streamingCharacterCursor = 0
        lastStreamingRenderTime = 0
        tableView.reloadData()
        scrollChatToBottom(animated: false)

        if streamingCharacters.isEmpty {
            stopAIResponseStreaming()
            return
        }

        aiStreamingTimer = Timer.scheduledTimer(withTimeInterval: 0.018, repeats: true) { [weak self] _ in
            self?.streamNextAIChunk()
        }
        if let timer = aiStreamingTimer {
            RunLoop.main.add(timer, forMode: .common)
        }
    }

    private func streamNextAIChunk() {
        guard let messageIndex = streamingMessageIndex,
              messageIndex < chatMessages.count else {
            stopAIResponseStreaming()
            return
        }

        let total = streamingCharacters.count
        if total == 0 {
            stopAIResponseStreaming()
            return
        }

        let chunkSize: Int
        if total > 700 {
            chunkSize = 6
        } else if total > 300 {
            chunkSize = 4
        } else {
            chunkSize = 2
        }

        let nextCursor = min(total, streamingCharacterCursor + chunkSize)
        chatMessages[messageIndex].text = String(streamingCharacters[0..<nextCursor])
        streamingCharacterCursor = nextCursor

        let now = CACurrentMediaTime()
        let shouldRender = (nextCursor >= total) || (lastStreamingRenderTime == 0) || (now - lastStreamingRenderTime >= 0.06)
        if shouldRender {
            renderStreamingMessage(at: messageIndex)
            lastStreamingRenderTime = now
            scrollChatToBottom(animated: false)
        }

        if streamingCharacterCursor >= total {
            stopAIResponseStreaming()
        }
    }

    private func stopAIResponseStreaming() {
        if let messageIndex = streamingMessageIndex,
           messageIndex < chatMessages.count,
           !pendingStreamingReferences.isEmpty {
            chatMessages[messageIndex].references = pendingStreamingReferences
            renderStreamingMessage(at: messageIndex, forceReload: true)
        }
        aiStreamingTimer?.invalidate()
        aiStreamingTimer = nil
        streamingCharacters.removeAll()
        pendingStreamingReferences.removeAll()
        streamingMessageIndex = nil
        streamingCharacterCursor = 0
        lastStreamingRenderTime = 0
        isStreamingAIResponse = false
        chatSendButton.alpha = 1.0
    }

    private func renderStreamingMessage(at messageIndex: Int, forceReload: Bool = false) {
        guard tableView.numberOfRows(inSection: 0) > messageIndex else {
            tableView.reloadData()
            return
        }

        let indexPath = IndexPath(row: messageIndex, section: 0)
        if !forceReload,
           let cell = tableView.cellForRow(at: indexPath),
           let textView = cell.contentView.subviews.compactMap({ $0 as? UITextView }).first {
            textView.attributedText = attributedAIMessageText(for: chatMessages[messageIndex])
            UIView.performWithoutAnimation {
                tableView.beginUpdates()
                tableView.endUpdates()
            }
            return
        }

        UIView.performWithoutAnimation {
            tableView.reloadRows(at: [indexPath], with: .none)
        }
    }

    private func appendMessage(_ text: String, isUser: Bool, references: [ChatReference] = []) {
        chatMessages.append(ChatMessage(text: text, isUser: isUser, references: references))
        tableView.reloadData()
        scrollChatToBottom(animated: false)
    }

    @objc private func chatInputTextDidChange() {
        let typedText = chatInputField.text.trimmingCharacters(in: .whitespacesAndNewlines)
        let shouldHide = !typedText.isEmpty
        if shouldHide != hideInitialAIMessageWhileTyping {
            hideInitialAIMessageWhileTyping = shouldHide
            tableView.reloadData()
        }
        updateChatInputHeight(animated: true)
    }

    private func visibleChatMessages() -> [ChatMessage] {
        if hideInitialAIMessageWhileTyping,
           chatMessages.count == 1,
           chatMessages.first?.isUser == false {
            return []
        }
        return chatMessages
    }

    private func typingIndicatorDots() -> NSAttributedString {
        let dots = NSMutableAttributedString()
        let activeDotIndex = typingAnimationStep % 3
        let activeColor = UIColor(white: 0.58, alpha: 1.0)
        let inactiveColor = UIColor(white: 0.75, alpha: 1.0)
        let dotFont = UIFont.systemFont(ofSize: 22, weight: .semibold)

        for index in 0..<3 {
            let color = index == activeDotIndex ? activeColor : inactiveColor
            dots.append(NSAttributedString(
                string: "•",
                attributes: [
                    .font: dotFont,
                    .foregroundColor: color
                ]
            ))
            if index < 2 {
                dots.append(NSAttributedString(
                    string: "",
                    attributes: [
                        .font: dotFont,
                        .foregroundColor: inactiveColor
                    ]
                ))
            }
        }

        return dots
    }

    private func typingIndicatorIndexPath() -> IndexPath? {
        guard isAwaitingAIResponse else { return nil }
        return IndexPath(row: visibleChatMessages().count, section: 0)
    }

    private func startTypingAnimation() {
        typingAnimationTimer?.invalidate()
        typingAnimationStep = 0
        typingAnimationTimer = Timer.scheduledTimer(withTimeInterval: 0.3, repeats: true) { [weak self] _ in
            guard let self = self, self.isAwaitingAIResponse else { return }
            self.typingAnimationStep += 1
            guard let indexPath = self.typingIndicatorIndexPath(),
                  self.tableView.numberOfRows(inSection: 0) > indexPath.row else { return }
            self.tableView.reloadRows(at: [indexPath], with: .none)
        }
    }

    private func stopTypingAnimation() {
        typingAnimationTimer?.invalidate()
        typingAnimationTimer = nil
        typingAnimationStep = 0
    }

    private func scrollChatToBottom(animated: Bool = true) {
        let visibleMessages = visibleChatMessages()
        let totalRows = visibleMessages.count + (isAwaitingAIResponse ? 1 : 0)
        guard totalRows > 0 else { return }
        let indexPath = IndexPath(row: totalRows - 1, section: 0)
        tableView.layoutIfNeeded()
        guard tableView.numberOfRows(inSection: 0) > indexPath.row else { return }
        tableView.scrollToRow(at: indexPath, at: .bottom, animated: animated)
    }

    private func registerForChatKeyboardNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(chatKeyboardWillShow(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(chatKeyboardWillHide(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    }

    @objc private func chatKeyboardWillShow(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let keyboardRect = (userInfo[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else { return }
        setChatInputMinimized(false, animated: true)
        let keyboardHeight = keyboardRect.height - view.safeAreaInsets.bottom
        chatKeyboardHeight = keyboardHeight
        chatInputBottomConstraint?.constant = -keyboardHeight - 8
        refreshChatInsets()
        UIView.animate(withDuration: 0.25) {
            self.chatInputContainer.superview?.layoutIfNeeded()
            self.view.layoutIfNeeded()
        }
        scrollChatToBottom(animated: false)
    }

    @objc private func chatKeyboardWillHide(_ notification: Notification) {
        chatKeyboardHeight = 0
        updateChatBottomDefaultOffset()
        chatInputBottomConstraint?.constant = -chatBottomDefaultOffset
        refreshChatInsets()
        UIView.animate(withDuration: 0.25) {
            self.chatInputContainer.superview?.layoutIfNeeded()
            self.view.layoutIfNeeded()
        }
    }



}

extension HomeViewController:UITableViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        guard isChatInterfaceEnabled, scrollView === tableView else { return }
        guard !chatInputField.isFirstResponder else { return }

        let currentOffset = scrollView.contentOffset.y
        let delta = currentOffset - lastScrollOffsetY
        lastScrollOffsetY = currentOffset

        if currentOffset <= 0 {
            setChatInputMinimized(false, animated: true)
            return
        }

        if delta > 6 {
            setChatInputMinimized(true, animated: true)
        } else if delta < -6 {
            setChatInputMinimized(false, animated: true)
        }
    }
}

extension HomeViewController:UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if isChatInterfaceEnabled {
            return visibleChatMessages().count + (isAwaitingAIResponse ? 1 : 0)
        }
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if isChatInterfaceEnabled {
            let visibleMessages = visibleChatMessages()
            if isAwaitingAIResponse && indexPath.row == visibleMessages.count {
                let cell = tableView.dequeueReusableCell(withIdentifier: "ChatCell", for: indexPath)
                cell.selectionStyle = .none
                cell.backgroundColor = .clear
                cell.contentView.backgroundColor = .clear
                cell.contentView.subviews.forEach { $0.removeFromSuperview() }

                let label = UILabel()
                label.translatesAutoresizingMaskIntoConstraints = false
                label.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
                label.attributedText = typingIndicatorDots()

                cell.contentView.addSubview(label)
                NSLayoutConstraint.activate([
                    label.leadingAnchor.constraint(equalTo: cell.contentView.leadingAnchor, constant: 16),
                    label.trailingAnchor.constraint(lessThanOrEqualTo: cell.contentView.trailingAnchor, constant: -16),
                    label.topAnchor.constraint(equalTo: cell.contentView.topAnchor, constant: 8),
                    label.bottomAnchor.constraint(equalTo: cell.contentView.bottomAnchor, constant: -8)
                ])
                return cell
            }
            let message = visibleMessages[indexPath.row]
            let isInitialCenteredAIState = !message.isUser && indexPath.row == 0 && visibleMessages.count == 1
            let cell = tableView.dequeueReusableCell(withIdentifier: "ChatCell", for: indexPath)
            cell.selectionStyle = .none
            cell.backgroundColor = .clear
            cell.contentView.backgroundColor = .clear
            cell.contentView.subviews.forEach { $0.removeFromSuperview() }

            let label = UILabel()
            label.translatesAutoresizingMaskIntoConstraints = false
            label.numberOfLines = 0
            let messageTextColor = message.isUser ? UIColor.white : UIColor.black
            label.textColor = messageTextColor
            label.attributedText = attributedChatText(
                from: message.text,
                baseFont: UIFont.systemFont(ofSize: 17, weight: .light),
                boldFont: UIFont.systemFont(ofSize: 17, weight: .semibold),
                textColor: messageTextColor,
                alignment: .left
            )
            
            if message.isUser {
                let bubble = UIView()
                bubble.translatesAutoresizingMaskIntoConstraints = false
                bubble.layer.cornerRadius = 16
                bubble.clipsToBounds = true
                bubble.backgroundColor = UIColor.black

                bubble.addSubview(label)
                cell.contentView.addSubview(bubble)

                NSLayoutConstraint.activate([
                    bubble.trailingAnchor.constraint(equalTo: cell.contentView.trailingAnchor, constant: -16),
                    bubble.topAnchor.constraint(equalTo: cell.contentView.topAnchor, constant: indexPath.row == 0 ? 18 : 8),
                    bubble.bottomAnchor.constraint(equalTo: cell.contentView.bottomAnchor, constant: -8),
                    bubble.widthAnchor.constraint(lessThanOrEqualTo: cell.contentView.widthAnchor, multiplier: 0.78),

                    label.topAnchor.constraint(equalTo: bubble.topAnchor, constant: 10),
                    label.bottomAnchor.constraint(equalTo: bubble.bottomAnchor, constant: -10),
                    label.leadingAnchor.constraint(equalTo: bubble.leadingAnchor, constant: 12),
                    label.trailingAnchor.constraint(equalTo: bubble.trailingAnchor, constant: -12)
                ])
            } else {
                if isInitialCenteredAIState {
                    cell.contentView.addSubview(label)
                    label.textAlignment = .center
                    label.textColor = UIColor(white: 0.25, alpha: 1.0)
                    let heading = "Apptorney AI"
                    let body = message.text
                    let combined = "\(heading)\n\(body)"
                    let attributed = NSMutableAttributedString(string: combined)
                    let paragraphStyle = NSMutableParagraphStyle()
                    paragraphStyle.lineSpacing = 2
                    paragraphStyle.alignment = .center
                    attributed.addAttribute(
                        .paragraphStyle,
                        value: paragraphStyle,
                        range: NSRange(location: 0, length: combined.count)
                    )
                    attributed.addAttribute(
                        .font,
                        value: UIFont.systemFont(ofSize: 18, weight: .semibold),
                        range: NSRange(location: 0, length: heading.count)
                    )
                    attributed.addAttribute(
                        .font,
                        value: UIFont.systemFont(ofSize: 18, weight: .light),
                        range: NSRange(location: heading.count, length: combined.count - heading.count)
                    )
                    label.attributedText = attributed

                    let logoView = UIImageView()
                    logoView.translatesAutoresizingMaskIntoConstraints = false
                    logoView.contentMode = .scaleAspectFit
                    logoView.image = UIImage(named: "login-icon")
                    cell.contentView.addSubview(logoView)

                    NSLayoutConstraint.activate([
                        logoView.centerXAnchor.constraint(equalTo: cell.contentView.centerXAnchor),
                        logoView.bottomAnchor.constraint(equalTo: label.topAnchor, constant: -24),
                        logoView.widthAnchor.constraint(equalToConstant: 64),
                        logoView.heightAnchor.constraint(equalToConstant: 64),

                        label.centerXAnchor.constraint(equalTo: cell.contentView.centerXAnchor),
                        label.centerYAnchor.constraint(equalTo: cell.contentView.centerYAnchor, constant: 22),
                        label.leadingAnchor.constraint(greaterThanOrEqualTo: cell.contentView.leadingAnchor, constant: 40),
                        label.trailingAnchor.constraint(lessThanOrEqualTo: cell.contentView.trailingAnchor, constant: -40)
                    ])
                } else {
                    let textView = UITextView()
                    textView.translatesAutoresizingMaskIntoConstraints = false
                    textView.backgroundColor = .clear
                    textView.isEditable = false
                    textView.isSelectable = true
                    textView.isScrollEnabled = false
                    textView.delegate = self
                    textView.textContainerInset = .zero
                    textView.textContainer.lineFragmentPadding = 0
                    textView.dataDetectorTypes = []
                    textView.linkTextAttributes = [
                        .foregroundColor: UIColor.black,
                        .underlineStyle: 0
                    ]
                    textView.attributedText = attributedAIMessageText(for: message)
                    cell.contentView.addSubview(textView)

                    NSLayoutConstraint.activate([
                        textView.leadingAnchor.constraint(equalTo: cell.contentView.leadingAnchor, constant: 16),
                        textView.trailingAnchor.constraint(equalTo: cell.contentView.trailingAnchor, constant: -16),
                        textView.topAnchor.constraint(equalTo: cell.contentView.topAnchor, constant: indexPath.row == 0 ? 18 : 8),
                        textView.bottomAnchor.constraint(equalTo: cell.contentView.bottomAnchor, constant: -8)
                    ])
                }
            }

            return cell
        }
        
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
            cell.accessoryType = .none
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
        if isChatInterfaceEnabled {
            return 1
        }
        return summaryHeadings.count
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if isChatInterfaceEnabled {
            return nil
        }
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

        headerCell.accessoryType = .none
        
        return headerCell
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if isChatInterfaceEnabled {
            return 0.01
        }
        
        if !loaded {
            return 0
        }
        if section == 0 {
            return 30
        }
        return 20
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if isChatInterfaceEnabled {
            let visibleMessages = visibleChatMessages()
            if visibleMessages.count == 1, let first = visibleMessages.first, !first.isUser, indexPath.row == 0 {
                return max(220, tableView.bounds.height - 180)
            }
            return UITableView.automaticDimension
        }
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

extension HomeViewController: UITextViewDelegate {
    func textViewDidBeginEditing(_ textView: UITextView) {
        if textView === chatInputField,
           chatMessages.count == 1,
           chatMessages.first?.isUser == false,
           !hideInitialAIMessageWhileTyping {
            hideInitialAIMessageWhileTyping = true
            tableView.reloadData()
        }
        updateChatInputHeight(animated: true)
    }

    func textViewDidChange(_ textView: UITextView) {
        if textView === chatInputField {
            chatInputTextDidChange()
        }
    }

    func textViewDidEndEditing(_ textView: UITextView) {
        if textView === chatInputField {
            let typedText = textView.text.trimmingCharacters(in: .whitespacesAndNewlines)
            let shouldHide = !typedText.isEmpty
            if shouldHide != hideInitialAIMessageWhileTyping {
                hideInitialAIMessageWhileTyping = shouldHide
                tableView.reloadData()
            }
        }
        updateChatInputHeight(animated: true)
    }

    func textView(_ textView: UITextView, shouldInteractWith URL: URL, in characterRange: NSRange) -> Bool {
        if textView === chatInputField {
            return true
        }
        return handleReferenceInteraction(url: URL)
    }

    @available(iOS 10.0, *)
    func textView(_ textView: UITextView, shouldInteractWith URL: URL, in characterRange: NSRange, interaction: UITextItemInteraction) -> Bool {
        if textView === chatInputField {
            return true
        }
        return handleReferenceInteraction(url: URL)
    }

    private func handleReferenceInteraction(url: URL) -> Bool {
        guard url.scheme == "apptorney-ref" else { return true }

        let sourceToken = (url.host ?? url.lastPathComponent).replacingOccurrences(of: "/", with: "").uppercased()
        guard !sourceToken.isEmpty, let reference = chatReference(for: sourceToken) else {
            return false
        }

        presentReference(reference)
        return false
    }
}
