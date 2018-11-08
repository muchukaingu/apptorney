//
//  IAPHandler.swift
//
//  Created by Dejan Atanasov on 13/07/2017.
//  Copyright © 2017 Dejan Atanasov. All rights reserved.
//
import UIKit
import StoreKit

enum IAPHandlerAlertType{
    case disabled
    case restored
    case purchased
    
    func message() -> String{
        switch self {
        case .disabled: return "Purchases are disabled in your device!"
        case .restored: return "You've successfully restored your purchase!"
        case .purchased: return "You've successfully bought this purchase!"
        }
    }
}


class IAPHandler: NSObject {
    static let shared = IAPHandler()
    
    let productId = "apptorney_subs"
    
    
    fileprivate var productID = ""
    fileprivate var productsRequest = SKProductsRequest()
    fileprivate var iapProducts = [SKProduct]()
    
    var purchaseStatusBlock: ((IAPHandlerAlertType) -> Void)?
    
    // MARK: - MAKE PURCHASE OF A PRODUCT
    func canMakePurchases() -> Bool {  return SKPaymentQueue.canMakePayments()  }
    
    func purchaseMyProduct(index: Int){
        if iapProducts.count == 0 { return }
        
        if self.canMakePurchases() {
            let product = iapProducts[index]
            let payment = SKPayment(product: product)
            SKPaymentQueue.default().add(self)
            SKPaymentQueue.default().add(payment)
            
            print("PRODUCT TO PURCHASE: \(product.productIdentifier)")
            productID = product.productIdentifier
        } else {
            purchaseStatusBlock?(.disabled)
        }
    }
    
    // MARK: - RESTORE PURCHASE
    func restorePurchase(){
        SKPaymentQueue.default().add(self)
        SKPaymentQueue.default().restoreCompletedTransactions()
    }
    
    
    // MARK: - FETCH AVAILABLE IAP PRODUCTS
    func fetchAvailableProducts(){
        
        // Put here your IAP Products ID's
        let productIdentifiers = NSSet(objects: productId
        )
        
        productsRequest = SKProductsRequest(productIdentifiers: productIdentifiers as! Set<String>)
        productsRequest.delegate = self
        productsRequest.start()
    }
    
    
    // MARK:- IAP RECEIPT VERIFICATION
    
    func receiptValidation(completionHandler:@escaping ((Bool)->Void)) {
        print("checking receipt validity");
        let SUBSCRIPTION_SECRET = "1de3f5d9ba4a43c69116ddb32cb40dda"
        let receiptPath = Bundle.main.appStoreReceiptURL?.path
        if FileManager.default.fileExists(atPath: receiptPath!){
            var receiptData:NSData?
            do{
                receiptData = try NSData(contentsOf: Bundle.main.appStoreReceiptURL!, options: NSData.ReadingOptions.alwaysMapped)
            }
            catch{
                print("ERROR: " + error.localizedDescription)
            }
            //let receiptString = receiptData?.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
            let base64encodedReceipt = receiptData?.base64EncodedString(options: NSData.Base64EncodingOptions.endLineWithCarriageReturn)
            
            //print(base64encodedReceipt!)
            
            
            let requestDictionary = ["receipt-data":base64encodedReceipt!,"password":SUBSCRIPTION_SECRET]
            
            guard JSONSerialization.isValidJSONObject(requestDictionary) else {  print("requestDictionary is not valid JSON");  return}
            do {
                let requestData = try JSONSerialization.data(withJSONObject: requestDictionary)
                let validationURLString = "https://buy.itunes.apple.com/verifyReceipt"  // this works but as noted above it's best to use your own trusted server
                guard let validationURL = URL(string: validationURLString) else { print("the validation url could not be created, unlikely error"); return}
                let session = URLSession(configuration: URLSessionConfiguration.default)
                var request = URLRequest(url: validationURL)
                request.httpMethod = "POST"
                request.cachePolicy = URLRequest.CachePolicy.reloadIgnoringCacheData
                let task = session.uploadTask(with: request, from: requestData) { (data, response, error) in
                    if let data = data , error == nil {
                        do {
                            let appReceiptJSON = try JSONSerialization.jsonObject(with: data)
                            //print("success. here is the json representation of the app receipt: \(appReceiptJSON)")
                            //print(self.expirationDateFromResponse(jsonResponse: appReceiptJSON as! NSDictionary))
                            //print(self.checkExpiry(expiryDate: self.expirationDateFromResponse(jsonResponse: appReceiptJSON as! NSDictionary)!)) // this is buggy!
                            if let expiryDate = self.expirationDateFromResponse(jsonResponse: appReceiptJSON as! NSDictionary){
                                let validity = self.checkExpiry(expiryDate: expiryDate)
                                completionHandler(validity)
                            } else {
                                completionHandler(true)
                            }
                           
                            
                            
                            // if you are using your server this will be a json representation of whatever your server provided
                        } catch let error as NSError {
                            print("json serialization failed with error: \(error)")
                        }
                    } else {
                        print("the upload task returned an error: \(error!)")
                    }
                }
                task.resume()
            } catch let error as NSError {
                print("json serialization failed with error: \(error)")
            }
            
            
            
        } else {
            print("Receipt not found");
            
            Subscription.checkSubscription(completionHandler: { (validity, err) in
                if err != nil {
                    print("error chikala")
                    completionHandler(false)
                } else {
                    print("Validity is \(validity)------------------------------------------------------------------------------------------->")
                    completionHandler(validity)
                }
                
                
            })
        }
        
    
    }
    
    
    // MARK: - GET EXPIRATION DATE
    
    
    func expirationDateFromResponse(jsonResponse: NSDictionary) -> Date? {
        
        if let receiptInfo: NSArray = jsonResponse["latest_receipt_info"] as? NSArray {
            
            let lastReceipt = receiptInfo.lastObject as! NSDictionary
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd HH:mm:ss VV"
            
            let expirationDate: Date =
                formatter.date(from: lastReceipt["expires_date"] as! String)!
            
            return expirationDate
            
        } else {
            
            return nil
            
        }
    }
    
    
}

extension IAPHandler: SKProductsRequestDelegate, SKPaymentTransactionObserver{
    // MARK: - REQUEST IAP PRODUCTS
    func productsRequest (_ request:SKProductsRequest, didReceive response:SKProductsResponse) {
        
        if (response.products.count > 0) {
            iapProducts = response.products
            for product in iapProducts{
                let numberFormatter = NumberFormatter()
                numberFormatter.formatterBehavior = .behavior10_4
                numberFormatter.numberStyle = .currency
                numberFormatter.locale = product.priceLocale
                let price1Str = numberFormatter.string(from: product.price)
                print(product.localizedDescription + "\nfor just \(price1Str!)")
            }
        }
    }
    
    func paymentQueueRestoreCompletedTransactionsFinished(_ queue: SKPaymentQueue) {
        purchaseStatusBlock?(.restored)
    }
    
    // MARK:- IAP PAYMENT QUEUE
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction:AnyObject in transactions {
            if let trans = transaction as? SKPaymentTransaction {
                switch trans.transactionState {
                case .purchased:
                    print("purchased")
                    SKPaymentQueue.default().finishTransaction(transaction as! SKPaymentTransaction)
                    purchaseStatusBlock?(.purchased)
                    break
                    
                case .failed:
                    print("failed")
                    SKPaymentQueue.default().finishTransaction(transaction as! SKPaymentTransaction)
                    break
                case .restored:
                    print("restored")
                    SKPaymentQueue.default().finishTransaction(transaction as! SKPaymentTransaction)
                    break
                    
                default: break
                }
                
            }
            
        }
    }
    
    
    func checkExpiry(expiryDate: Date) -> Bool {
        
        let calendar = Calendar.current
        
        // Extract the components of the dates
        let date1Components = calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: expiryDate)
        let date2Components = calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: Date())
        
        print("Current date and time \(Date())")
        
        // Check if the dates are in the same month and day
        let greaterYear = date1Components.year! >= date2Components.year!
        let greaterMonth = date1Components.month! >= date2Components.month!
        let greaterDay = date1Components.day! >= date2Components.day!
        
        // Skip this if you want to check only the date and not the time
        let greaterHour = date1Components.hour! >= date2Components.hour!
        let greaterMinute = date1Components.minute! > date2Components.minute!
       
        
       
        
        return greaterYear && greaterMonth && greaterDay && greaterHour && greaterMinute
    }
    

}
