'use strict'
angular.module('apptorney')
  .controller('WorkReferenceController', function($scope,Work, $location, $global, datetime){

    $scope.selectedType = "";
    $scope.selected = false;
    $scope.work = {};
    $scope.works = [];
    $scope.returned = false;
    $scope.showWorks = false;



    $scope.loadWorkReferences = function(type) {
      Work.find(
        function(res) {
          $scope.works = res.data;

          $scope.returned = true;
          $scope.showWorks = true;
        },
        function(errorResponse) { }
      );
    }

    $scope.loadWorkReferences();



    $scope.saveWork = function(){
      console.log($scope.work);
      Work.upsert($scope.work,
        function(work){
          $scope.works.push(work);
        },
        function(errorResponse){

        }
      );

      $("#addWorkModal").modal("hide");

    }

    $scope.deleteWork = function(workID){

      Work.deleteById({ id: workID })
      .$promise
      .then(function() {
        //console.log('deleted');
        $scope.works.forEach(function(work){
          if(work.id == workID){
            $scope.works.splice($scope.works.indexOf(work),1);

          }
        });
      });

    }





  });
