'use strict'
angular.module('apptorney')
  .filter('dateSuffix', function($filter) {
      var suffixes = ["th", "st", "nd", "rd"];
      return function(input) {
        var dtfilter = $filter('date')(input, 'dd');
        var day = parseInt(dtfilter.slice(-2));
        var relevantDigits = (day < 30) ? day % 20 : day % 30;
        var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
        return dtfilter+suffix;
      };
  })
  .controller('LegislationController', function($rootScope,$scope, $filter, Legislation, LegislationType, LegislationPart, PartType, $location, $global, datetime, $routeParams, filterFilter, baseURL){

    $scope.selectedType = "";
    $scope.selected = false;
    $scope.legislation = {};
    $scope.legislationPart = {};
    $scope.returned = false;
    $scope.showLegislations = false;
    $scope.message = "Loading...";
    $scope.legislationTypesReturned = false;
    $scope.showLegislationTypes = false;
    $scope.legislationType = {};
    $scope.legislationPartType = {};
    $scope.legislationPartTypesReturned = false;
    $scope.showLegislationPartTypes = false;
    $scope.saveStatus = 0;
    $scope.baseURL = baseURL.replace("/api/",""); //Hack to show images and file links in Legislation







    $scope.loadLegislationTypes = function(){
      $scope.legislationTypes =  LegislationType.find(
        function(list) {
          $scope.legislationTypesReturned = true;
          $scope.showLegislationTypes = true;
        },
        function(errorResponse) { }
      );
    }

    $scope.loadLegislationPartTypes = function(){
      $scope.legislationPartTypes =  PartType.find(
        function(list) {
          $scope.legislationPartTypesReturned = true;
          $scope.showLegislationPartTypes = true;
        },
        function(errorResponse) { }
      );
    }

    $scope.loadLegislationTypes();
    $scope.loadLegislationPartTypes();

    $scope.saveLegislationType = function(){
      LegislationType.upsert($scope.legislationType,
        function(legislationType){
          $scope.legislationTypes.push(legislationType);
        },
        function(errorResponse){

        }
      );

      $("#addLegislationTypeModal").modal("hide");

    }

    $scope.saveLegislationPartType = function(){
      PartType.upsert($scope.legislationPartType,
        function(legislationPartType){
          $scope.legislationPartTypes.push(legislationPartType);
        },
        function(errorResponse){

        }
      );

      $("#addLegislationPartType").modal("hide");

    }




    $scope.typeSelected = function(typeOfLegislation){
      $scope.selected = true;
      $scope.legislation.legislationType = typeOfLegislation.id
      $scope.selectedType = typeOfLegislation.name;
    }




    $scope.saveLegislation = function(){
            $scope.saveStatus = 1;
            $scope.legislation.generalTitle = "Government of Zambia";
            console.log($rootScope.user);
            if($scope.legislation.completionStatus == true){
              $scope.legislation.capturedById = $rootScope.user.id;
            }

            Legislation.upsert($scope.legislation,
              function(legislation){
                console.log("Saved");

                $scope.saveStatus = 2;
                setTimeout(function(){ $scope.saveStatus = 0; console.log("Save Status = " + $scope.saveStatus); $("#applicationForm").click(); }, 10000);
                $scope.openLegislation(legislation);


              },
              function(errorResponse){

              }
            );
            //$scope.legislations.push($scope.legislation);

            //$("#addLegislationModal").modal("hide");

    }





    $scope.deleteLegislation = function(legislationID){

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




    $scope.deleteLegislationPartType = function(legislationPartTypeID){
      PartType.deleteById({ id: legislationPartTypeID })
      .$promise
      .then(function() {
        //console.log('deleted');
        $scope.legislationPartTypes.forEach(function(legislationPartType){
          if(legislationPartType.id == legislationPartTypeID){
            $scope.legislationPartTypes.splice($scope.legislationPartTypes.indexOf(legislationPartType),1);

          }
        });
      });

    }




    $scope.legislations = Legislation.find({
      filter:{include: {
        relation: 'capturedBy', // include the owner object
        scope: { // further filter the owner object
          fields: ['firstName','lastName'] // only show two fields
        }
      },
      fields:{
        legislationParts:false,
        enactment: false,
        generalTitle: false,
        preamble:false
      }}},
      function(list) {
        //console.log(list);
        console.log($routeParams.id);
        $scope.legislations = filterFilter($scope.legislations, $routeParams.id);
        $scope.returned = true;
        $scope.showLegislations = true;
      },
      function(errorResponse) { }
    );

    $scope.completedLegislations = [];
    $scope.legislations.forEach(function(legislation){
      if (legislation.completionStatus == true){
        $scope.completedLegislations.push(legislation);
      }
    });




    $scope.newLegislation = function(){ //fires when user opens the create modal for the first time
      $scope.legislation = {};
      $scope.legislation.legislationParts = [];
      $scope.selected=false;
      $scope.showParts = true;

    }





    $scope.openLegislation = function(legislation){
      $scope.models = {
       selected: null
      };

      $scope.viewMode = true;
      Legislation.find({
        filter:{where: {
          id: legislation.id
        }
        }},
        function(list) {

          var instance = list[0];

          angular.forEach(instance, function(value, key){
            $scope.legislation[key] = value;
          });


          $scope.legislationTypes.forEach(function(type){
            if(type.id == $scope.legislation.legislationType){
              $scope.selected = true;
              $scope.selectedType = type.name;
            }
          })
          if(typeof $scope.legislation.dateOfAssent == 'string'){
            $scope.legislation.dateOfAssent = $scope.legislation.dateOfAssent.substring(0,10);
            var parser = datetime("yyyy-MM-dd");

            $scope.legislation.dateOfAssent = parser.parse($scope.legislation.dateOfAssent).getDate();

          }
          $scope.returned = true;
          $scope.showLegislations = true;
        },
        function(errorResponse) { }
      );


      $scope.showParts = true;
      $scope.parts_returned = true;

      /*$scope.legislationParts =  Legislation.legislationParts({id:legislation.id, filter: {order: 'orderIndex ASC'}},
        function(parts) {
          //var i = 0;
          parts.forEach(function(part){
            part.viewMode = false;
            part.orderIndex = parseInt(part.orderIndex);

            //part.orderIndex = i;
            //i++;
          });


          $scope.showParts = true;
          $scope.parts_returned = true;
          $scope.opened = true;
          //$filter('orderBy')(parts,'orderIndex');

        },
        function(errorResponse) { }
      ); */



    }



    $scope.openLegislationType = function(legislationType){
      $scope.legislationType = legislationType;
    }

    $scope.openLegislationPartType = function(legislationPartType){
      $scope.legislationPartType = legislationPartType;
    }



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
      $scope.legislation.legislationParts.push({title:'PART ' + $scope.romanize($scope.legislation.legislationParts.length + 1)});
      //$("#addLegislationPart").modal("hide");
      console.log($scope.legislation.legislationParts);
    }

    $scope.openAddLegislationPartModal = function(){
      //$scope.legislationPart = new Object();
    }

    $scope.toggleView = function(){
      if ($scope.viewMode == false){
        $scope.viewMode = true;
      }
      else {
        $scope.viewMode = false;
      }
    }

    $scope.$watch('legislationParts', function(model) {
      //$scope.modelAsJson = angular.toJson(model, true);
      //$scope.legislationParts = model;
      //console.log($scope.opened);
      /*if($scope.opened){
        var i = 0;
        $scope.legislationParts.forEach(function(part){
          part.orderIndex = i;
          i++;
        });
        console.log(angular.toJson(model, true));
      }*/


    }, true);

    $scope.reOrder = function(index){
      //console.log(index);
      $scope.legislationParts.splice(index, 1);
      var i = 0;
      $scope.legislationParts.forEach(function(part){
        part.orderIndex = i;
        i++;
      });

      //console.log(angular.toJson($scope.legislationParts, true));

    }

    $scope.editPart = function(scope){
      $scope.legislationPart = scope.$modelValue;
      if($scope.legislationPart.table==undefined){
          $scope.legislationPart.showTable = false;
      }
      else{
          //$scope.legislationPart.tableHeaders = Object.keys($scope.legislationPart.table[0]);
          $scope.legislationPart.showTable = true;
      }
    }

    $scope.romanize = function (num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                   "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    $scope.addTable = function(){
      $scope.legislationPart.showTable = true;
      if($scope.legislationPart.table == undefined){
        $scope.legislationPart.table = {};
        $scope.legislationPart.table.content = [{}];
        $scope.legislationPart.table.tableHeaders = ["column1","column2","column3"];
        $scope.legislationPart.table.title = "Table Heading";

      }


    }



  });
