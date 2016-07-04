'use strict';

angular.module('apptorney')

        /*
        Service Name: applicationService
        Author: Muchu Kaingu
        Description:  Provides a resource to interact with applicants API
        */
        .service('caseService', ['$resource','baseURL',function($resource, baseURL) {

                this.getCases = function(){

                    return $resource(baseURL+"cases",null,  {
                        query:{
                                method:'GET',
                                isArray:true,
                                //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            },
                        update: {method : "POST"}
                    });

                };
        }])

        .service('userService', ['$resource','baseURL',function($resource, baseURL) {

                this.getUsers = function(){

                    return $resource(baseURL+"users/:email",null,  {
                        query:{
                                method:'GET',
                                isArray:true,
                                //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            },
                        update: {method : "PUT"}
                    });

                };


                this.generatePassword = function(){
    	              var text = "";
          				  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          				  for( var i=0; i < 8; i++ ){
          				      text += possible.charAt(Math.floor(Math.random() * possible.length));
          				  }
          				  return text;
                }


                this.login = function(){

                    return $resource(baseURL+"Users/login",null,  {
                      query:{
                              method:'GET',
                              isArray:true,
                              //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                          },
                      exec: {method : "POST"}
                    });

                };

        }])



;
