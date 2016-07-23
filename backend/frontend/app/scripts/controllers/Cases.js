'use strict'
angular.module('apptorney')
.directive('setFocus', function(){
  return{
      scope: {setFocus: '='},
      link: function(scope, element){
         if(scope.setFocus) element[0].focus();
      }
  };
})
.controller('CasesController',function ($scope, $timeout, Court, Case, AreaOfLaw,Jurisdiction, Location, baseURL, filterFilter) {
    console.log("xxx---->");










         $scope.message = "Loading data. Please wait...";
         $scope.filtered = false;
         $scope.saved = false;
         $scope.returned = false;
         $scope.showCases = false;
         $scope.cases = [];
         $scope.dirtyFields = [];
         $scope.currentCase = {};
         $scope.case = {};
         $scope.case.parties = {};
         $scope.case.parties.defendants = [];
         $scope.case.parties.plaintiffs = [];
         $scope.plaintiff = {};
         $scope.defendant = {};
         $scope.advocate = {};
         $scope.judge = {};
         $scope.case.parties.defendantAdvocates = [];
         $scope.case.parties.plaintiffAdvocates = [];
         $scope.case.parties.selectedPlaintiffAdvocates = [];
         $scope.legislations = [];

         $scope.courts = [];
         $scope.court = {};

         $scope.locations = [];
         $scope.location = {};


         $scope.jurisdictions = [];
         $scope.jurisdiction = {};

         $scope.areaOfLaw = {};
         $scope.areasOfLaw = [];

         $scope.case.coram = [];


         $scope.cases = Case.find(
           function(list) {
             console.log(list);
             $scope.returned = true;
             $scope.showCases = true;
           },
           function(errorResponse) { }
         );


         $scope.addCaseParties = function(){
           $scope.case.parties.defendants.push(angular.copy($scope.defendant));
           $scope.case.parties.plaintiffs.push(angular.copy($scope.plaintiff));
           $scope.case.parties.plaintiffAdvocates.push(angular.copy($scope.advocate));
           $scope.case.parties.defendantAdvocates.push(angular.copy($scope.advocate));
           $scope.case.coram.push(angular.copy($scope.judge));


         }

         $scope.addCaseParties();

         $scope.addDefendant = function(event){
           if(event.which === 13){
              $scope.case.parties.defendants.push(angular.copy($scope.defendant));
              console.log($scope.case);
           }
         }

         $scope.addPlaintiff = function(event){
           if(event.which === 13){
              $scope.case.parties.plaintiffs.push(angular.copy($scope.plaintiff));
           }

         }

         $scope.addPlaintiffAdvocate = function(event){
           if(event.which === 13){
              $scope.case.parties.plaintiffAdvocates.push(angular.copy($scope.advocate));
              console.log($scope.case);
           }

         }

         $scope.addDefendantAdvocate = function(event){
           if(event.which === 13){
              $scope.case.parties.defendantAdvocates.push(angular.copy($scope.advocate));
              console.log($scope.case);
           }

         }

         $scope.addJudge = function(event){
           if(event.which === 13){
              $scope.case.coram.push(angular.copy($scope.judge));
              console.log($scope.judge);
           }

         }






         $scope.areasOfLaw = AreaOfLaw.find(
           function(list) {
             console.log(list);
             $scope.areasReturned = true;
             $scope.showAreas = true;
           },
           function(errorResponse) { }
         );

         $scope.saveAreaOfLaw = function(){
           console.log($scope.areaOfLaw);
           AreaOfLaw.upsert($scope.areaOfLaw,
             function(area){
               $scope.areasOfLaw.push(area);
             },
             function(errorResponse){

             }
           );

           $("#addAreaOfLawModal").modal("hide");

         }


         $scope.locations = Location.find(
           function(list) {
             console.log(list);
             $scope.locationsReturned = true;
             $scope.showLocations = true;
           },
           function(errorResponse) { }
         );

         $scope.saveLocation = function(){
           console.log($scope.location);
           Location.upsert($scope.location,
             function(location){
               $scope.locations.push(location);
             },
             function(errorResponse){

             }
           );

           $("#addLocationModal").modal("hide");

         }

         $scope.deleteLocation = function(locationID){

           Location.deleteById({ id: locationID })
           .$promise
           .then(function() {
             //console.log('deleted');
             $scope.locations.forEach(function(location){
               if(location.id == locationID){
                 $scope.locations.splice($scope.locations.indexOf(location),1);

               }
             });
           });

         }


         $scope.jurisdictions = Jurisdiction.find(
           function(list) {
             console.log(list);
             $scope.jurisdictionsReturned = true;
             $scope.showJurisdictions = true;
           },
           function(errorResponse) { }
         );

         $scope.saveJurisdiction = function(){
           console.log($scope.jurisdiction);
           Jurisdiction.upsert($scope.jurisdiction,
             function(jurisdiction){
               $scope.jurisdictions.push(jurisdiction);
             },
             function(errorResponse){

             }
           );

           $("#addJurisdictionModal").modal("hide");

         }

         $scope.deleteJurisdiction = function(jurisdictionID){

           Jurisdiction.deleteById({ id: jurisdictionID })
           .$promise
           .then(function() {
             //console.log('deleted');
             $scope.jurisdictions.forEach(function(jurisdiction){
               if(jurisdiction.id == jurisdictionID){
                 $scope.jurisdictions.splice($scope.jurisdictions.indexOf(jurisdiction),1);

               }
             });
           });

         }



        







  });


  var openAddAreaOfLaw = function(){
    //$("#addAreaOfLawModal").modal();
    console.log("opened");
    $('#addAreaOfLawModal').appendTo("body").modal('show');
  }

  var openAddCourt = function(){
    //$("#addAreaOfLawModal").modal();
    $('#addCourtModal').appendTo("body").modal('show');
  }

  var openAddLegislation = function(){
    //$("#addAreaOfLawModal").modal();
    $('#addLegislationModal').appendTo("body").modal('show');
  }
