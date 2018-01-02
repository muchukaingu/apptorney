'use strict'
angular.module('apptorney')
  .controller('CourtController', function($scope,Court, CourtDivision, $location, $global, datetime){

    $scope.selectedType = "";
    $scope.selected = false;
    $scope.court = {};
    $scope.courts = [];
    $scope.courtsReturned = false;
    $scope.showCourts = false;

    $scope.division = {};
    $scope.divisions = [];







    $scope.courts = Court.find(
      function(list) {
        
        $scope.courtsReturned = true;
        $scope.showCourts = true;
      },
      function(errorResponse) { }
    );

    $scope.divisions.push(angular.copy($scope.division));


    $scope.addDivision = function(event){

      if(event.which === 13){
         $scope.divisions.push(angular.copy($scope.division));

      }

    }


    // $scope.saveCourt = function(){
    //   console.log($scope.court);
    //   Court.upsert($scope.court,
    //     function(court){
    //       console.log(court);
    //       $scope.courts.push(court);
    //       court.divisions.create($scope.division);
    //     },
    //     function(errorResponse){
    //
    //     }
    //   );
    //
    //   $("#addCourtModal").modal("hide");
    //
    // }


    $scope.saveCourt = function(){

            Court.upsert($scope.court,
              function(court){

                $scope.divisions.forEach(function(division){
                  division.court = court.id;
                  CourtDivision.upsert(division);
                });
              },
              function(errorResponse){

              }
            );
            $scope.courts.push($scope.court);

            $("#addCourtModal").modal("hide");

    }



    // $scope.deleteCourt = function(courtID){
    //
    //   Court.deleteById({ id: courtID })
    //   .$promise
    //   .then(function() {
    //     //console.log('deleted');
    //     $scope.courts.forEach(function(court){
    //       if(court.id == courtID){
    //         $scope.courts.splice($scope.courts.indexOf(court),1);
    //
    //       }
    //     });
    //   });
    //
    // }


    $scope.deleteCourt = function(courtID){
      CourtDivision.find({ court: courtID },
      function(divisions){
        divisions.forEach(function(division){
          CourtDivision.deleteById({id: division.id});
        });
      },
      function(err){

      }
    );
      Court.deleteById({ id: courtID })
      .$promise
      .then(function() {
        //console.log('deleted');
        $scope.courts.forEach(function(court){
          if(court.id == courtID){
            $scope.courts.splice($scope.courts.indexOf(court),1);

          }
        });
      });

    }


    $scope.divisionsForCourt = function(courtID) {

      $scope.divisions = CourtDivision.find({ court: courtID },
      function(divisions){
        console.log(divisions);
      },
      function(err){

      });

    }




    $scope.openAddDivisionModal = function(){
      //$scope.division = new Object();
    }


    $scope.saveCase = function(){
      console.log($scope.case);
    }





  });
