
import Foundation
import Alamofire
import SwiftyJSON



protocol APIServiceDelegate: class {
    func APIServiceDidFinish(ApiService: APIService, result: Any?)
    func APIServiceFailedWithError(ApiService: APIService, error: Error?, userInfo: Any?)
}

class APIService {
    
    static let urlBase          = "http://localhost:3009/api" //production
//    static let urlBase          = "https://apptorney-api.eu-gb.mybluemix.net/api" //production
   // static let urlBase          = "https://apptorney-backend-test.eu-gb.mybluemix.net/api" //test
    static let appUsersURL      = urlBase + "/appusers"
    static let casesURL         = urlBase + "/cases"
    weak var delegate: APIServiceDelegate?
    
    func get(endPoint:String, parameters:Any?, completionHandler:@escaping (Data?, Error?)->Void){
        let headers = [
            //"X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //retiring
            //"X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //retiring
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953", //migration
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b" //migration
            
            
        ]
        if let parameters: Parameters = parameters as? Parameters {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseData { response in
                
                switch response.result {
                case .success:
                    print("Validation Successful")
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    print(response.result.value)
                    completionHandler(nil, error)
                    
                }
                
            }
        } else {
            Alamofire.request(APIService.urlBase + endPoint, method: .get, headers: headers).validate().responseData { response in
                
                switch response.result {
                case .success:
                    print("Validation Successful")
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    print(response.result.value)
                    completionHandler(nil, error)
                    
                }
                
            }
        }
       
        

       
    }
    
    
    func getAsJSON(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            //"X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            //"X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953", //migration
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b" //migration
            
        ]
        
        Alamofire.request(APIService.urlBase + endPoint, method: .get, parameters: parameters, headers: headers).validate().responseJSON { response in
            print(response)
            
            
            switch response.result {
            case .success:
                //print("Validation Successful")
                if let data = response.result.value {
                    
                    completionHandler(data, nil)
                }
            case .failure(let error):
               
                print(error)
                completionHandler(nil, error)
            
            }
        }
    }
    
    func post(endPoint:String, parameters:Any, completionHandler:@escaping (Any?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            //"X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            //"X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953", //migration
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b" //migration
            
        ]

        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers:headers).validate().responseJSON { response in
            
            
            switch response.result {
                case .success:
                    
                    if let data = response.result.value {
                        completionHandler(data, nil)
                    }
                case .failure(let error):
                    completionHandler(nil, error)
                
            }
            
        }
    }
    
    func postWithResponseFormat(endPoint:String, parameters:Any, completionHandler:@escaping (Data?, Error?)->Void){
        let parameters: Parameters = parameters as! Parameters
        let headers = [
            //"X-IBM-Client-ID": "6f423f6d-5514-4c5f-bf5c-0f0ce138d523", //production
            //"X-IBM-Client-Secret": "273733c1-f6c0-4f1f-ae1d-cd01c92676a2" //production
            //            "X-IBM-Client-ID": "e7aebcd3-ea44-4b68-89e7-821817a1b5f6", //test
            //            "X-IBM-Client-Secret": "fb67bc04-b06d-402f-be8b-d4969279b11b" //test
            
            "X-IBM-Client-ID": "4449615d-b5b2-4e16-a059-f6bda4486953", //migration
            "X-IBM-Client-Secret": "81ed3948-6ca5-4936-be0b-5db9aec1107b" //migration
            
        ]
        
        Alamofire.request(APIService.urlBase + endPoint, method: .post, parameters: parameters, headers:headers).responseData { response in
            
            
            switch response.result {
            case .success:
                //print("Validation Successful")
                if let data = response.result.value {
                    
                    completionHandler(data, nil)
                }
            case .failure(let error):
                
                print(error)
                completionHandler(nil, error)
                
            }
            
        }
    }
    
    func put(){
        
    }
    
    func delete(){
        
    }
    
}

