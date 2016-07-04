'use strict'
angular.module('apptorney')
  .controller('LegislationPartTypeController', function($scope,Legislation, LegislationType, PartType, $location, $global){

    $scope.selectedType = "";
    $scope.selected = false;
    $scope.LegislationPartType = {};
    $scope.returned = false;
    $scope.showLegislationPartTypes = false;
    $scope.message = "Loading..."

    //Legislation Part Type Functionality

    $scope.partTypeSelection = false;
    $scope.selectedPartType = "";

    $scope.loadLegislationPartTypes = function(){
      $scope.legislationPartTypes =  PartType.find(
        function(list) {
            $scope.returned = true;
            $scope.showLegislationPartTypes = true;
        },
        function(errorResponse) {
          $scope.returned = true;
          $scope.showLegislationPartTypes = false;
          $scope.message = "Error Loading Data. Please Reload."
        }
      );
    }

    $scope.loadLegislationPartTypes();

    $scope.partTypeSelected = function(partType){
      $scope.partTypeSelection = true;
      $scope.legislationPart.legislationPartType = partType.id
      $scope.selectedPartType = partType.name;
    }

    $scope.saveLegislationPartType = function(){
      PartType.create({name:$scope.name});
      $scope.loadLegislationPartTypes();
    }

  });
