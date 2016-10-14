'use strict'
angular.module('apptorney')
.controller('UsersController', ['$location','$scope', '$timeout','userService','baseURL', '$global',function ($location, $scope, $timeout, userService, baseURL, $global) {

        $global.set('fullscreen', true);

        $scope.$on('$destroy', function () {
          $global.set('fullscreen', false);
        });
         $scope.resetting = false;
         $scope.status = {};
         $scope.resetPassword = function(){
	         $scope.resetting = true;
	         console.log("resetting...");
	         $scope.user.password = userService.generatePassword();
             userService.getUsers().update({email:$scope.user.emailAddress},JSON.stringify($scope.user))
             .$promise.then(

	             function(response){
		             $scope.status.message = "Your password has successfully been reset. Please check your email for your login details.";

		             console.log("success...");
	             },
	             function(response){
		              $scope.status.message = "Your password could not be reset. Please use the email address you used to register.";

	             }
             );
         }

         $scope.resetting = false;
         $scope.authenticated = false;
         $scope.loginAttempt = false;
         $scope.user = {};
         $scope.user.email = "";
         $scope.user.password = "";
         $scope.authenticating = false;
         $scope.login = function(){
           $scope.authenticating = true;
           $scope.loginAttempt = false;
           $scope.authenticated = false;
           var data = JSON.stringify($scope.user);
           userService.login().save(data)
           .$promise.then(

             function(response){
               $scope.status.message = "Your password has successfully been reset. Please check your email for your login details.";
               $location.path('/dashboard');
               console.log("success...");
               $scope.authenticating = false;

             },
             function(response){
                $scope.authenticating = false;
                $scope.status.message = "Login failed. Invalid credentials provided.";
                $scope.loginAttempt = true;
                $scope.authenticated = false;



             }
           );
         }

         $scope.$watchCollection('user', function() {
           console.log("Mambo!");
           $scope.loginAttempt = false;
         });




  }])
  .controller('LoginCtrl', function($rootScope,$scope,Appuser, $location, $global){
    $scope.status = {};
    $scope.resetting = false;
    $scope.authenticated = false;
    $scope.loginAttempt = false;
    $scope.user = {};
    $scope.user.email = "";
    $scope.user.password = "";
    $scope.authenticating = false;
    $global.set('fullscreen', true);

    $scope.$on('$destroy', function () {
      $global.set('fullscreen', false);
    });
    $scope.login = function(){

      $scope.loginResult = Appuser.login($scope.user,
        function(res){
          $global.set('user', res.user);
          $scope.status.message = "Login Successful.";
          $location.path('/dashboard');
          console.log("success...");
          $scope.authenticating = false;
          $rootScope.isLoggedIn = true;
          $rootScope.user = res.user;
          console.log($rootScope.user);
        },
        function(res){
          $scope.authenticating = false;
          $scope.status.message = "Login failed. Invalid credentials provided.";
          $scope.loginAttempt = true;
          $scope.authenticated = false;
        }
      )
    }

    

    $scope.$watchCollection('user', function() {
      console.log("Mambo!");
      $scope.loginAttempt = false;
    });


  });
