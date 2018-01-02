'use strict'
angular.module('apptorney')
  .controller('SynonymController', function($scope,PlaintiffSynonyms, DefendantSynonyms, $location, $global, datetime){

    $scope.selectedType = "";
    $scope.selected = false;

    $scope.defendantSynonym = {};
    $scope.defendantSynonyms = [];

    $scope.defendantSynonymsReturned = false;
    $scope.showDefendantSynonyms = false;

    $scope.plaintiffSynonymsReturned = false;
    $scope.showPlaintiffSynonyms = false;

    $scope.plaintiffSynonym = {};
    $scope.plaintiffSynonyms = [];







    $scope.plaintiffSynonyms = PlaintiffSynonyms.find(
      function(list) {

        $scope.plaintiffSynonymsReturned = true;
        $scope.showPlaintiffSynonyms = true;
      },
      function(errorResponse) { }
    );

    $scope.savePlaintiffSynonym = function(){

            PlaintiffSynonyms.upsert($scope.plaintiffSynonym,
              function(plaintiffSynonym){

              },
              function(errorResponse){

              }
            );
            $scope.plaintiffSynonyms.push($scope.plaintiffSynonym);

            $("#addPlaintiffSynonymModal").modal("hide");

    }



    $scope.deletePlaintiffSynonym = function(synonymID){

      PlaintiffSynonyms.deleteById({ id: synonymID })
      .$promise
      .then(function() {
        $scope.plaintiffSynonyms.forEach(function(synonym){
          if(synonym.id == synonymID){
            $scope.plaintiffSynonyms.splice($scope.plaintiffSynonyms.indexOf(synonym),1);

          }
        });

      });

    }






    //----------------------------DefendantSynonyms-----------------------------------------------


    $scope.defendantSynonyms = DefendantSynonyms.find(
      function(list) {

        $scope.defendantSynonymsReturned = true;
        $scope.showDefendantSynonyms = true;
      },
      function(errorResponse) { }
    );

    $scope.saveDefendantSynonym = function(){

            DefendantSynonyms.upsert($scope.defendantSynonym,
              function(defendantSynonym){

              },
              function(errorResponse){

              }
            );
            $scope.defendantSynonyms.push($scope.defendantSynonym);

            $("#addDefendantSynonymModal").modal("hide");

    }



    $scope.deleteDefendantSynonym = function(synonymID){
      console.log("deleting "+synonymID);
      DefendantSynonyms.deleteById({ id: synonymID })
      .$promise
      .then(function() {
        $scope.defendantSynonyms.forEach(function(synonym){
          if(synonym.id == synonymID){
            $scope.defendantSynonyms.splice($scope.defendantSynonyms.indexOf(synonym),1);

          }
        });

      });

    }





    $scope.openAddDivisionModal = function(){
      //$scope.division = new Object();
    }


    $scope.saveCase = function(){
      console.log($scope.case);
    }





  });
