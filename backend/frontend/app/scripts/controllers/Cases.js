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
.controller('CasesController', ['$scope', '$timeout','caseService','baseURL', 'filterFilter',function ($scope, $timeout, caseService, baseURL, filterFilter) {
    console.log("xxx---->");
          // $("#s2id_areaOfLaw").select2({
          //     formatNoMatches: function(term) {
          //         return "<a onclick='openPOCustomerModal()' data-toggle='modal'><i class='fa fa-plus'></i>Add Customer</a>";
          //     },
          //     placeholder: 'Area of Law',
          //     minimumInputLength: 3
          // });



            var areaOfLaw = $("select#areaOfLaw").select2();
            var court = $("select#court").select2();
            var legislation = $("select#legislation").select2();
            areaOfLaw.select2({
              formatNoMatches: function(term) {
                  return "<a data-toggle='modal' onclick='openAddAreaOfLaw()'><i class='fa fa-plus'></i>&nbsp;Add Area of Law</a>";
              },
              minimumInputLength: 2
            });

            court.select2({
              formatNoMatches: function(term) {
                  return "<a onclick='openAddCourt()' data-toggle='modal'><i class='fa fa-plus'></i>&nbsp;Add Court</a>";
              },
              minimumInputLength: 2
            });

            legislation.select2({
              formatNoMatches: function(term) {
                  return "<a onclick='openAddLegislation()' data-toggle='modal'><i class='fa fa-plus'></i>&nbsp;Add Legislation</a>";
              },
              minimumInputLength: 2
            });



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
         $scope.case.parties.defendantAdvocates = [];
         $scope.case.parties.plaintiffAdvocates = [];


         caseService.getCases().query()
         .$promise.then(

             function(response){
	               $scope.showCases = true;
                 $scope.returned = true;
                 $scope.cases = response;
                 console.log($scope.cases);

             },
             function(response){
	             $scope.returned = true;
	             console.log(response.status);
	             if (response.status==404){
		             $scope.message = "There are currently no cases.";
	             }


             }

         )


         $scope.showApplication = function(id){
            $scope.currentApplication = $scope.applications[id];
            applicationService.getSubmissionsForApplication().query({applicationid:$scope.currentApplication.applicationID})
            .$promise.then(
                function(response){
                    $scope.returned = true;
                    for (var field in response){

                            $scope.currentApplication.idea = response[0].submittedText;
                            $scope.currentApplication.solution = response[1].submittedText;
                            $scope.currentApplication.product = response[2].submittedText;
                            $scope.currentApplication.market = response[3].submittedText;
                            $scope.currentApplication.revenue = response[4].submittedText;
                            $scope.currentApplication.team = response[5].submittedText;
                            $scope.currentApplication.strategy = response[6].submittedText;
                            $scope.currentApplication.funding = response[7].submittedText;

                    }



                }

            )

         }

         $scope.showApplicationLongFormUsingID = function(id){
            $scope.currentApplication = $scope.applications[id];
            applicationService.getSubmissionsForApplication().query({applicationid:$scope.currentApplication.applicationID})
            .$promise.then(
                function(response){
                    $scope.returned = true;
                    for (var field in response){

                            $scope.currentApplication.idea = response[0].submittedText;
                            $scope.currentApplication.solution = response[1].submittedText;
                            $scope.currentApplication.product = response[2].submittedText;
                            $scope.currentApplication.market = response[3].submittedText;
                            $scope.currentApplication.revenue = response[4].submittedText;
                            $scope.currentApplication.team = response[5].submittedText;
                            $scope.currentApplication.strategy = response[6].submittedText;
                            $scope.currentApplication.funding = response[7].submittedText;
                            $scope.currentApplication.customer = response[8].submittedText;

                    }



                }

            )

         }



         $scope.saveApplication = function(){
	         console.log("saving");
             //$scope.application = {};
             $scope.application.numberOfReviews = 0;
             $scope.application.dateCreated = new Date().toISOString();
             $scope.application.competitionStageID = 1;
             $scope.application.createdBy = 38;
             $scope.application.status = 0;
             $scope.application.isInternalApplication = 1;
             $scope.application.weightedScore = 0;
             var data = JSON.stringify($scope.application);
             applicationService.getApplications().save(data);
             $scope.showApplications = true;
             $scope.applications.push( $scope.application);


         }


         $scope.showApplicationLongForm = function(){
	         console.log("Fyeah! xxx");

	         $scope.applications.forEach(function(app){
		            if (app.email == $emailAddress){

			         $scope.currentApplication = app;
			         applicationService.getSubmissionsForApplication().query({applicationid:$scope.currentApplication.applicationID})
		            .$promise.then(
		                function(response){
			                $scope.returned = true;
			                for (var field in response){


			                    if(response[field].applicationSectionID == 1){
				                    $scope.currentApplication.businessIdea = response[field].submittedText;
				                  $scope.dirtyFields.push("businessIdea");
			                    }
			                    else if (response[field].applicationSectionID == 2){
				                     $scope.currentApplication.solution = response[field].submittedText;
				                  $scope.dirtyFields.push("solution");
			                    }

			                    else if (response[field].applicationSectionID == 3){
				                     $scope.currentApplication.product = response[field].submittedText;
				                  $scope.dirtyFields.push("product");
			                    }

			                    else if (response[field].applicationSectionID == 4){
				                     $scope.currentApplication.market = response[field].submittedText;
				                  $scope.dirtyFields.push("market");
			                    }

			                    else if (response[field].applicationSectionID == 5){
				                     $scope.currentApplication.revenue = response[field].submittedText;
				                  $scope.dirtyFields.push("revenue");
			                    }

			                    else if (response[field].applicationSectionID == 6){
				                     $scope.currentApplication.teamInformation = response[field].submittedText;
				                  $scope.dirtyFields.push("teamInformation");
			                    }

			                    else if (response[field].applicationSectionID == 7){
				                     $scope.currentApplication.strategy = response[field].submittedText;
				                  $scope.dirtyFields.push("strategy");
			                    }

			                    else if (response[field].applicationSectionID == 8){
				                     $scope.currentApplication.funding = response[field].submittedText;
				                  $scope.dirtyFields.push("funding");
			                    }
			                    else if (response[field].applicationSectionID == 9){
				                     $scope.currentApplication.customer = response[field].submittedText;
				                  $scope.dirtyFields.push("customer");
			                    }









		                 }
		                 console.log($scope.currentApplication);

		                },
		                function(response){

			                $scope.dirtyFields = [];
		                }

		            )

		         }

	         })





         }



         $scope.saveApplicationLongForm = function(){
	         $scope.saved = true;
	         console.log($scope.dirtyFields);
             //$scope.application = {};
             var submission = {};

             for (var entry in $scope.currentApplication){

             	if (entry == "businessIdea"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:1,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "solution"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:2,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "product"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:3,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "market"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:4,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "revenue"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:5,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "teamInformation"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:6,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "strategy"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:7,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "funding"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:8,submittedText: $scope.currentApplication[entry]};
             	}
             	else if (entry == "customer"){
	             	submission = {applicationID: $scope.currentApplication.applicationID, applicationSectionID:9,submittedText: $scope.currentApplication[entry]};
             	}
             	else{
	             	submission = {};
             	}
             	var data = JSON.stringify(submission);
             	if (submission.applicationID!==undefined){
	             	if($.inArray(entry,$scope.dirtyFields)!==-1){
		             	//console.log(entry);
		             	//console.log($scope.dirtyFields);
		             	console.log("updating!");

					 	applicationService.getSubmissionsForApplication().update({applicationid:$scope.currentApplication.applicationID},data);
					}
					else {
						console.log("creating!");

					 	applicationService.getSubmissionsForApplication().save({applicationid:$scope.currentApplication.applicationID},data);
					}

             	}



             }

            setTimeout(function() {
		       $scope.saved=false;
		       console.log("time up");

		    }, 3000);

/*
             $scope.application.numberOfReviews = 0;
             $scope.application.dateCreated = new Date().toISOString();
             $scope.application.competitionStageID = 1;
             $scope.application.createdBy = 38;
             $scope.application.status = 0;
             $scope.application.isInternalApplication = 1;
             $scope.application.weightedScore = 0;
             var data = JSON.stringify($scope.application);
             applicationService.getApplications().save(data);
             $scope.showApplications = true;
             $scope.applications.push( $scope.application);
*/





         }

         $scope.itemselected = function(stage){
	         $scope.filtered = true;
	         $scope.selectedItem = stage;


         }

         $scope.addCaseParties = function(){
           $scope.case.parties.defendants.push(angular.copy($scope.defendant));
           $scope.case.parties.plaintiffs.push(angular.copy($scope.plaintiff));
           $scope.case.parties.plaintiffAdvocates.push(angular.copy($scope.advocate));
           $scope.case.parties.defendantAdvocates.push(angular.copy($scope.advocate));

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







         /*var data = $.param({
                viewApplication:20
            });

            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            $http.post(baseURL+"Applications.php",  data, config)
            .then(
                function(response){

                    $scope.applicant = response.data[2];
                    console.log(response.statusText);
                },
                function(response){

                }
            )


        */




  }]);


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
