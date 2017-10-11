
import Foundation
import Alamofire
import SwiftyJSON



protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {
    
    static let urlBase          = "http://circuit.cloudapp.net:3001/api"
    static let appUsersURL      = urlBase + "/appusers"
    static let casesURL         = urlBase + "/cases"
    weak var delegate: APIServiceDelegate?
    
    func get(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters).responseJSON { response in
            print(response.result)
            if let JSON = response.result.value {
                //let error: Error?
                let result = JSON
                
                print("Send to delegate")
                completionHandler(result, nil)
                //self.delegate?.APIServiceDidFinish(ApiService: self, result: JSON)
            }
            else {
                print ("No data received")
            }
            
        }
    }
    
    func post(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters).responseJSON { response in
            if let JSON = response.result.value {
                //let error: Error?
                let result = JSON

                print("Send to delegate")
                completionHandler(result, nil)
                //self.delegate?.APIServiceDidFinish(ApiService: self, result: JSON)
            }
            
        }
    }
    
    func put(){
        
    }
    
    func delete(){
        
    }
    
}

