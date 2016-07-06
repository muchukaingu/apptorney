'use strict'
angular.module('apptorney')
  .controller('LegislationController', function($scope,Legislation, LegislationType, LegislationPart, PartType, $location, $global){

    $scope.selectedType = "";
    $scope.selected = false;
    $scope.legislation = {};
    $scope.returned = false;
    $scope.showLegislations = false;
    $scope.message = "Loading...";
    $scope.legislationTypesReturned = false;
    $scope.showLegislationTypes = false;

    $scope.saveLegislationType = function(){
      LegislationType.create({name:$scope.legislationType.name});
      $scope.loadLegislationTypes();
      $("#addLegislationTypeModal").modal("hide");
    }

    $scope.loadLegislationTypes = function(){
      $scope.legislationTypes =  LegislationType.find(
        function(list) {
          $scope.legislationTypesReturned = true;
          $scope.showLegislationTypes = true;
        },
        function(errorResponse) { }
      );
    }

    $scope.loadLegislationTypes();

    $scope.typeSelected = function(typeOfLegislation){
      $scope.selected = true;
      $scope.legislation.legislationType = typeOfLegislation.id
      $scope.selectedType = typeOfLegislation.name;
    }

    $scope.saveLegislation = function(){
            $scope.legislation.generalTitle = "Government of Zambia";
            Legislation.upsert($scope.legislation,
              function(legislation){
                console.log($scope.legislationParts);
                $scope.legislationParts.forEach(function(legislationPart){
                  legislationPart.legislation = legislation.id;
                  LegislationPart.upsert(legislationPart);
                });
              },
              function(errorResponse){

              }
            );
            $scope.legislations.push($scope.legislation);

    }

    $scope.deleteLegislation = function(legislationID){
      Legislation.legislationParts.destroyAll({ legislation: legislationID });
      Legislation.deleteById({ id: legislationID })
      .$promise
      .then(function() {
        //console.log('deleted');
        $scope.legislations.forEach(function(legislation){
          if(legislation.id == legislationID){
            $scope.legislations.splice($scope.legislations.indexOf(legislation),1);

          }
        });
      });

    }

    $scope.deleteLegislationType = function(legislationTypeID){
      LegislationType.deleteById({ id: legislationTypeID })
      .$promise
      .then(function() {
        //console.log('deleted');
        $scope.legislationTypes.forEach(function(legislationType){
          if(legislationType.id == legislationTypeID){
            $scope.legislationTypes.splice($scope.legislationTypes.indexOf(legislationType),1);

          }
        });
      });

    }

    $scope.legislations = Legislation.find(
      function(list) {
        console.log(list);
        $scope.returned = true;
        $scope.showLegislations = true;
      },
      function(errorResponse) { }
    );

    $scope.openLegislation = function(legislation){
      $scope.legislation = legislation;
      $scope.legislationParts =  LegislationPart.find({legislation:legislation.id},
        function(list) {

        },
        function(errorResponse) { }
      );

    }

    $scope.legislationPartTypes =  PartType.find(
      function(list) {

      },
      function(errorResponse) { }
    );

    $scope.selectedPartType = "";
    $scope.partTypeSelected = false;
    $scope.selectPartType = function(type){
      $scope.partTypeSelected = true;
      $scope.legislationPart.partType = type.id;
      $scope.selectedPartType = type.name;
      console.log($scope.legislationPart);

    }
    $scope.legislationPart = {};
    $scope.legislationParts = [];

    $scope.addLegislationPart = function(){
      $scope.legislationParts.push(angular.copy($scope.legislationPart));
      //$("#addLegislationPart").modal("hide");
      console.log($scope.legislationParts);
    }

    $scope.openAddLegislationPartModal = function(){
      //$scope.legislationPart = new Object();
    }




  });
