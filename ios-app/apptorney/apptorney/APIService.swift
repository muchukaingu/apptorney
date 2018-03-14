
import Foundation
import Alamofire
import SwiftyJSON



protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {
    
    static let urlBase          = "https://circuitbusiness-apptorney.eu-gb.mybluemix.net/api" //production
   // static let urlBase          = "https://apptorney-backend-test.eu-gb.mybluemix.net/api" //test
    static let appUsersURL      = urlBase + "/appusers"
    static let casesURL         = urlBase + "/cases"
    weak var delegate: APIServiceDelegate?
    
    func get(endPoint:String, parameters:Any, completionHandler:@escaping (Data?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            "X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            "X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
//            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
//            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test

        ]

        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).responseData { response in
          
            if let data = response.result.value {
                print(data)
                let error = JSON(data)["error"]
                if error != nil {
                    completionHandler(nil, NSError(domain:error["code"].string!, code:error["statusCode"].int!, userInfo:nil))
                    
                }
                else {
                    let result = data
                    completionHandler(result, nil)
                }
                //self.delegate?.APIServiceDidFinish(ApiService: self, result: JSON)
            }
            else {
                print ("No data received")
            }
            
        }
    }
    
    
    func getAsJSON(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            "X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            "X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            
        ]
        
        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).responseJSON { response in
            print(response)
            if let data = response.result.value {
                print(data)
                let error = JSON(data)["error"]
                if error != nil {
                    completionHandler(nil, NSError(domain:error["code"].string!, code:error["statusCode"].int!, userInfo:nil))
                    
                }
                else {
                    let result = data
                    completionHandler(result, nil)
                }
                //self.delegate?.APIServiceDidFinish(ApiService: self, result: JSON)
            }
            else {
                completionHandler(nil, nil)
            }
            
        }
    }
    
    func post(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            "X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            "X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            
        ]

        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers:headers).responseJSON { response in
            if let data = response.result.value {
                //let error: Error?
                
                let error = JSON(data)["error"]
                if error != nil {
                    completionHandler(nil, NSError(domain:error["code"].string!, code:error["statusCode"].int!, userInfo:nil))
                
                }
                else {
                    let result = data
                    completionHandler(result, nil)
                }
                
               
                //self.delegate?.APIServiceDidFinish(ApiService: self, result: JSON)
            }
            
        }
    }
    
    func put(){
        
    }
    
    func delete(){
        
    }
    
}

