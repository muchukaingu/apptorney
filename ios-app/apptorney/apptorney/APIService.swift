
import Foundation
import Alamofire
import SwiftyJSON



protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {
    
    static let urlBase          = "https://circuitbusiness-apptorney.eu-gb.mybluemix.net/api"
    static let appUsersURL      = urlBase + "/appusers"
    static let casesURL         = urlBase + "/cases"
    weak var delegate: APIServiceDelegate?
    
    func get(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            "X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523",
            "X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2"
        ]

        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).responseJSON { response in
          
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

