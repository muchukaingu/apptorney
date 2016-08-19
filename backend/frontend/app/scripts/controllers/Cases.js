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
         $scope.case.citation = {};
         $scope.case.defendants = [];
         $scope.case.plaintiffs = [];
         $scope.plaintiff = {};
         $scope.defendant = {};
         $scope.appearance = {};
         $scope.judge = {};
         $scope.case.appearancesForDefendants = [];
         $scope.case.appearancesForPlaintiffs = [];
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


         $scope.cases = Case.find({
           filter:{include: {
             relation: 'areaOfLaw', // include the owner object
             scope: { // further filter the owner object
               fields: ['name','id'] // only show two fields
             }
           }}},
           function(cases) {

             cases.forEach(function(aCase){
               Court.find({id:aCase.courtId},
                 function(court){
                  aCase.court = court[0].name;
                  console.log(court);
                 },
                 function(err){}
               );
               aCase.accuser = "";
               aCase.accused = "";
               if(aCase.plaintiffs.length > 1){
                 aCase.accuser = aCase.plaintiffs[0].name + " and Others";
               }
               else {
                 aCase.accuser = aCase.plaintiffs[0].name;
               }

               if(aCase.defendants.length > 1){
                 aCase.accused = aCase.defendants[0].name + " and Others";
               }
               else {
                 aCase.accused = aCase.defendants[0].name;
               }

               aCase.name = aCase.accuser + " Vs. "+aCase.accused;

             });



             $scope.cases = cases;



             $scope.returned = true;
             $scope.showCases = true;

           },
           function(errorResponse) { }
         );


         $scope.addCaseParties = function(){
           $scope.case.defendants.push(angular.copy($scope.defendant));
           $scope.case.plaintiffs.push(angular.copy($scope.plaintiff));
           $scope.case.appearancesForPlaintiffs.push(angular.copy($scope.appearance));
           $scope.case.appearancesForDefendants.push(angular.copy($scope.appearance));
           $scope.case.coram.push(angular.copy($scope.judge));


         }

         $scope.addCaseParties();

         $scope.addDefendant = function(event){
           if(event.which === 13){
              $scope.case.defendants.push(angular.copy($scope.defendant));

           }
         }

         $scope.addPlaintiff = function(event){
           if(event.which === 13){
              $scope.case.plaintiffs.push(angular.copy($scope.plaintiff));
           }

         }

         $scope.addPlaintiffAdvocate = function(event){
           if(event.which === 13){
              $scope.case.appearancesForPlaintiffs.push(angular.copy($scope.appearance));

           }

         }

         $scope.addDefendantAdvocate = function(event){
           if(event.which === 13){
              $scope.case.appearancesForDefendants.push(angular.copy($scope.appearance));

           }

         }

         $scope.addJudge = function(event){
           if(event.which === 13){
              $scope.case.coram.push(angular.copy($scope.judge));

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



         $scope.saveCase = function(){

                 Case.upsert($scope.case,
                   function(aCase){
                     console.log(aCase);
                     $scope.cases.push(aCase);
                     console.log($scope.cases);
                   },
                   function(errorResponse){

                   }
                 );


                 $("#addCaseModal").modal("hide");



         }


         $scope.openCase = function(aCase){
           $scope.case = aCase;
           $scope.case.citation.year = parseInt($scope.case.citation.year);
           console.log($scope.case.citation.year);
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
