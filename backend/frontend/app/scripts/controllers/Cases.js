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
.controller('CasesController',function ($scope, $timeout, Court, Case, AreaOfLaw, baseURL, filterFilter) {
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

         $scope.courts = [];
         $scope.court = {};

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



         $scope.courts = Court.find(
           function(list) {
             console.log(list);
             $scope.courtsReturned = true;
             $scope.showCourts = true;
           },
           function(errorResponse) { }
         );

         $scope.saveCourt = function(){
           console.log($scope.court);
           Court.upsert($scope.court,
             function(court){
               $scope.courts.push(court);
             },
             function(errorResponse){

             }
           );

           $("#addCourtModal").modal("hide");

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





  });


  var openAddAreaOfLaw = function(){
    //$("#addAreaOfLawModal").modal();
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
