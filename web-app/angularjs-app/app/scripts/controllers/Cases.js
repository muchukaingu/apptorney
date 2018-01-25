'use strict'
angular.module('apptorney')
    .directive('setFocus', function() {
        return {
            scope: { setFocus: '=' },
            link: function(scope, element) {
                if (scope.setFocus) element[0].focus()
            }
        }
    })
    .controller('CasesController', function($rootScope, $bootbox, $scope, $location, $timeout, Court, Case, Legislation, Work, CaseLegislations, CaseCases, CaseWorks, AreaOfLaw, Jurisdiction, Location, baseURL, filterFilter, $routeParams) {
        // console.log("xxx---->")//

        $scope.opened = true
        $scope.message = 'Loading data. Please wait...'
        $scope.filtered = false
        $scope.saved = false
        $scope.returned = false
        $scope.showCases = false
        $scope.cases = []
        $scope.dirtyFields = []
        $scope.currentCase = {}
        $scope.case = {}
        $scope.case.parties = {}
        $scope.case.citation = {}
        $scope.case.defendants = []
        $scope.case.plaintiffs = []
        $scope.case.areasOfLaw = []
        $scope.plaintiff = {}
        $scope.defendant = {}
        $scope.appearance = {}
        $scope.judge = {}
        $scope.case.appearancesForDefendants = []
        $scope.case.appearancesForPlaintiffs = []
        $scope.case.parties.selectedPlaintiffAdvocates = []
        $scope.legislations = []
        $scope.saveStatus = 0
        $scope.caseStab = {}
        $scope.legislationStab = {}
        $scope.workStab = {}
        $scope.queries = {}
        $scope.caseReferences = []
        $scope.legislationReferences = []
        $scope.workReferences = []
        $scope.mergeStatus = 0
        $scope.sortType = 'fields.name'

        $scope.courts = []
        $scope.court = {}

        $scope.locations = []
        $scope.location = {}

        $scope.jurisdictions = []
        $scope.jurisdiction = {}

        $scope.areaOfLaw = {}
        $scope.areasOfLaw = []

        $scope.case.coram = []
        $scope.totalPages = 0
        $scope.itemsPerPage = 100
        $scope.totalCases = 0

        $scope.showReferences = function(references) {
            var ids = []
            references.forEach(function(reference) {
                console.log(reference.caseId)
                ids.push(reference.caseId)
            })

            Case.namesakes({ id: JSON.stringify(ids) },
                function(res) {
                    console.log(res.data)
                    $scope.cases = res.data.namesakes
                    $scope.returned = true
                    $scope.showCases = true
                },
                function(errorResponse) {}
            )
        }

        $scope.toggleView = function() {
            if ($scope.viewMode == false) {
                $scope.viewMode = true
            } else {
                $scope.viewMode = false
            }
        }

        $scope.deleteCase = function(aCase) {
            bootbox.confirm({
                message: 'Are you sure you want to delete the case <strong>' + aCase.name + '</strong>?',
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-danger'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-primary'
                    }
                },
                callback: function(result) {
                    aCase.primaryDeletion = 1
                    aCase.secondaryDeletion = 0
                    aCase.deleteFlag = 1 // Used to notify API that delete button has been clicked

                    Case.upsert(aCase,
                        function(deleted) {
                            console.log('Deletion was Successful')
                            $scope.cases.splice($scope.cases.indexOf(aCase), 1)
                        },
                        function(error) {}
                    )

                    console.log('This was logged in the callback: ' + result)
                }
            })
        }

        $scope.mergeDuplicates = function() {
            $scope.mergeStatus = 1

            Case.mergeDuplicates({ id: JSON.stringify($rootScope.caseInstance.uniqueIds), primary: $scope.case.id },
                function(res) {
                    console.log('Merged Cases For: ' + $scope.case.name)
                    $scope.mergeStatus = 2
                    $scope.cases = filterFilter($scope.cases, $scope.case.id)
                        // $scope.legislation = undefined

                },
                function(err) {
                    console.error('Error occured')
                }
            )
        }

        $scope.createStab = function(newCase) {
            if (typeof newCase === 'string') {
                var plaintiff = ''
                var defendant = ''
                var separator = 0
                if (newCase.indexOf('Vs') !== -1) {
                    separator = newCase.indexOf('Vs')
                } else if (newCase.indexOf('vs') !== -1) {
                    separator = newCase.indexOf('vs')
                } else if (newCase.indexOf('VS') !== -1) {
                    separator = newCase.indexOf('VS')
                }

                // console.info("Separator is ", separator)
                plaintiff = newCase.substring(0, separator - 1)
                defendant = newCase.substring(separator + 3, newCase.length)

                $scope.caseStab.plaintiffs = []
                $scope.caseStab.defendants = []

                $scope.caseStab.plaintiffs.push({ name: plaintiff })
                $scope.caseStab.defendants.push({ name: defendant })
                $scope.caseStab.name = newCase
                $scope.caseStab.autogenerated = true

                // console.info("Stab is", $scope.caseStab)
            }
        }

        $scope.saveStab = function(event) {
            // console.info("This is the detected text", $scope.queries.caseReferencesQuery)
            $scope.createStab($scope.queries.caseReferencesQuery)
            if (event.which === 13) {
                // console.log("Savng Stab...")

                Case.upsert($scope.caseStab,
                    function(aCase) {
                        var caseArray = []

                        $scope.caseReferences = Case.find({
                                filter: {
                                    fields: {
                                        defendants: true,
                                        plaintiffs: true,
                                        id: true

                                    },
                                    where: {
                                        id: aCase.id
                                    }
                                }
                            },
                            function(cases) {
                                cases.forEach(function(aCase) {
                                    aCase.accuser = ''
                                    aCase.accused = ''
                                    if (aCase.plaintiffs.length > 1) {
                                        aCase.accuser = aCase.plaintiffs[0].name + ' and Others'
                                    } else {
                                        aCase.accuser = aCase.plaintiffs[0].name
                                    }

                                    if (aCase.defendants.length > 1) {
                                        aCase.accused = aCase.defendants[0].name + ' and Others'
                                    } else {
                                        aCase.accused = aCase.defendants[0].name
                                    }

                                    aCase.name = aCase.accuser + ' Vs ' + aCase.accused
                                })

                                // console.info("Retained | Returned Case References", aCase)

                            },
                            function(errorResponse) {}
                        )
                    },
                    function(error) {}
                )
            }
        }

        $scope.createLegislationStab = function(newLegislation) {
            if (typeof newLegislation === 'string') {
                $scope.legislationStab.legislationName = newLegislation
                $scope.legislationStab.autogenerated = true
            }
        }

        $scope.saveLegislationStab = function(event) {
            $scope.createLegislationStab($scope.queries.legislationReferencesQuery)
            if (event.which === 13) {
                Legislation.upsert($scope.legislationStab,
                    function(legislation) {
                        $scope.legislationReferences.push(legislation)
                            // $scope.case.legislationsReferedTo.push(legislation)
                    },
                    function(error) {}
                )
            }
        }

        $scope.createWorkStab = function(newWork) {
            if (typeof newWork === 'string') {
                $scope.workStab.name = newWork
                $scope.workStab.autogenerated = true
            }
        }

        $scope.saveWorkStab = function(event) {
            $scope.createWorkStab($scope.queries.workReferencesQuery)
            if (event.which === 13) {
                Work.upsert($scope.workStab,
                    function(work) {
                        $scope.workReferences.push(work)
                            // $scope.case.legislationsReferedTo.push(legislation)
                    },
                    function(error) {}
                )
            }
        }

        $scope.getTotalCases = function() {
            Case.count({}, function(result) {
                $scope.totalCases = result.count
                $scope.totalPages = Math.ceil($scope.totalCases / $scope.itemsPerPage)
                    // console.info("Total number of pages = ", $scope.totalPages)
            }, function(error) {})
        }

        $scope.getTotalCases()

        $scope.newCase = function() {
            console.info('new case created')
            $scope.case = {}
            $scope.case.isNew = true
            console.info($scope.case.isNew)

            $scope.case.parties = {}
            $scope.case.citation = {}
            $scope.case.defendants = []
            $scope.case.plaintiffs = []
            $scope.case.coram = []
            $scope.plaintiff = {}
            $scope.defendant = {}
            $scope.appearance = {}
            $scope.judge = {}
            $scope.case.appearancesForDefendants = []
            $scope.case.appearancesForPlaintiffs = []
            $scope.case.parties.selectedPlaintiffAdvocates = []
            $scope.case.legislationsReferedTo = []
            $scope.case.workReferedTo = []
            $scope.case.casesReferedTo = []
            $scope.addCaseParties()
        }

        $scope.searching = false

        $scope.$watch('$routeParams', function() {
            var newEvent = {}
            if (!isNaN(parseInt($routeParams.year))) {
                newEvent.which = 13
                $scope.searchForCases(newEvent)
            }
            if ($location.path().indexOf('/cleanup-cases/detail') !== -1) {
                console.log('Route Params xxxxxxxxxxxx ', $routeParams.year)
                $scope.loadCases('occurences')
            } else if ($location.path().indexOf('/cleanup-cases') !== -1) {
                console.log('Route Params xxxxxxxxxxxx ', $routeParams.year)
                $scope.loadCases('duplicates')
            } else if ($location.path() == '/trash/cases') {
                $scope.loadCases('trash')
            }
        })

        $scope.loadCases = function(type) {
            if (type == 'duplicates') {
                Case.getDuplicates({ limit: 100, skip: 0, /*query:$scope.query*/ },
                    function(res) {
                        $scope.cases = res.data.duplicates
                        $scope.numberOfItemsPerPage = res.data.duplicates.length
                        $scope.totalItems = res.data.uniqueCount
                            // $scope.legislations = filterFilter($scope.legislations, $routeParams.id)
                        $scope.returned = true
                        $scope.showCases = true
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'occurences') {
                Case.namesakes({ id: JSON.stringify($rootScope.caseInstance.uniqueIds) },
                    function(res) {
                        console.log(res.data)
                        $scope.cases = res.data.namesakes
                        $scope.returned = true
                        $scope.showCases = true
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'trash') {
                console.log('Loading trash...')
                Case.viewTrash(
                    function(res) {
                        console.log(res.data)
                        $scope.cases = res.data.trash
                        $scope.returned = true
                        $scope.showCases = true
                    },
                    function(errorResponse) {}
                )
            }
        }

        $scope.showDuplicatesDetail = function(caseInstance) {
            $rootScope.caseInstance = caseInstance
            $location.path('/cleanup-cases/detail')
        }

        $scope.searchForCases = function(event) {
            if (event.which === 13) {
                $scope.searching = true
                var yearFilter = {}
                console.log(parseInt($scope.query))
                if (!isNaN(parseInt($scope.query))) {
                    yearFilter = { 'citation.year': parseInt($scope.query) }
                } else {
                    if (!isNaN(parseInt($routeParams.year))) {
                        yearFilter = { 'citation.year': parseInt($routeParams.year) }
                    } else {
                        yearFilter = { 'capturedBy': $scope.query }
                    }
                }

                $scope.cases = Case.find({
                        filter: {
                            where: {
                                or: [
                                    { and: [{ name: { like: '.*' + ($scope.query || $routeParams.year) + '.*' } }, { deleted: { neq: true } }] }, { and: [yearFilter, { deleted: { neq: true } }] }, { and: [{ caseNumber: { like: '.*' + ($scope.query || $routeParams.year) + '.*' } }, { deleted: { neq: true } }] }
                                ]
                            },
                            fields: {
                                id: true,
                                name: true,
                                caseNumber: true,
                                completionStatus: true,
                                autoGenerated: true,
                                citation: true,
                                deleted: true,
                                isStub: true

                            }
                        }
                    },
                    function(res) {
                        // $scope.cases = filterFilter($scope.cases, "!primaryDeletion")
                        $scope.searching = false
                        $scope.cases = res.data

                        $scope.returned = true
                        $scope.showCases = true
                    },
                    function(errorResponse) {}
                )
            }
        }

        $scope.addCaseParties = function() {
            $scope.case.defendants.push(angular.copy($scope.defendant))
            $scope.case.plaintiffs.push(angular.copy($scope.plaintiff))
            $scope.case.appearancesForPlaintiffs.push(angular.copy($scope.appearance))
            $scope.case.appearancesForDefendants.push(angular.copy($scope.appearance))
            $scope.case.coram.push(angular.copy($scope.judge))
        }

        $scope.addCaseParties()

        $scope.addDefendant = function(event) {
            if (event.which === 13) {
                $scope.case.defendants.push(angular.copy($scope.defendant))
            }
        }

        $scope.addPlaintiff = function(event) {
            if (event.which === 13) {
                $scope.case.plaintiffs.push(angular.copy($scope.plaintiff))
            }
        }

        $scope.addPlaintiffAdvocate = function(event) {
            if (event.which === 13) {
                $scope.case.appearancesForPlaintiffs.push(angular.copy($scope.appearance))
            }
        }

        $scope.addDefendantAdvocate = function(event) {
            if (event.which === 13) {
                $scope.case.appearancesForDefendants.push(angular.copy($scope.appearance))
            }
        }

        $scope.addJudge = function(event) {
            if (event.which === 13) {
                $scope.case.coram.push(angular.copy($scope.judge))
            }
        }

        $scope.areasOfLaw = AreaOfLaw.find(
            function(list) {
                // console.log(list)
                $scope.areasReturned = true
                $scope.showAreas = true
            },
            function(errorResponse) {}
        )

        $scope.saveAreaOfLaw = function() {
            // console.log($scope.areaOfLaw)
            AreaOfLaw.upsert($scope.areaOfLaw,
                function(area) {
                    $scope.areasOfLaw.data.push(area)
                },
                function(errorResponse) {}
            )

            $('#addAreaOfLawModal').modal('hide')
        }

        $scope.locations = Location.find(
            function(list) {
                // console.log(list)
                $scope.locationsReturned = true
                $scope.showLocations = true
            },
            function(errorResponse) {}
        )

        $scope.saveLocation = function() {
            // console.log($scope.location)
            Location.upsert($scope.location,
                function(location) {
                    $scope.locations.push(location)
                },
                function(errorResponse) {}
            )

            $('#addLocationModal').modal('hide')
        }

        $scope.deleteLocation = function(locationID) {
            Location.deleteById({ id: locationID })
                .$promise
                .then(function() {
                    // //console.log('deleted')
                    $scope.locations.forEach(function(location) {
                        if (location.id == locationID) {
                            $scope.locations.splice($scope.locations.indexOf(location), 1)
                        }
                    })
                })
        }

        $scope.jurisdictions = Jurisdiction.find(
            function(list) {
                // console.log(list)
                $scope.jurisdictionsReturned = true
                $scope.showJurisdictions = true
            },
            function(errorResponse) {}
        )

        $scope.saveJurisdiction = function() {
            // console.log($scope.jurisdiction)
            Jurisdiction.upsert($scope.jurisdiction,
                function(jurisdiction) {
                    $scope.jurisdictions.push(jurisdiction)
                },
                function(errorResponse) {}
            )

            $('#addJurisdictionModal').modal('hide')
        }

        $scope.deleteJurisdiction = function(jurisdictionID) {
            Jurisdiction.deleteById({ id: jurisdictionID })
                .$promise
                .then(function() {
                    // //console.log('deleted')
                    $scope.jurisdictions.forEach(function(jurisdiction) {
                        if (jurisdiction.id == jurisdictionID) {
                            $scope.jurisdictions.splice($scope.jurisdictions.indexOf(jurisdiction), 1)
                        }
                    })
                })
        }

        $scope.saveCase = function() {
            // console.info("Case Details", $scope.case)
            $scope.saveStatus = 1
            $scope.case.areasOfLawIds = []
            $scope.case.areaOfLawId = $scope.case.areaOfLaw ? $scope.case.areaOfLaw.id : ''
            if ($scope.case.areasOfLaw !== undefined || $scope.case.areasOfLaw.length > 0) {
                $scope.case.areasOfLaw.map(function(caseInstance) {
                    $scope.case.areasOfLawIds.push(caseInstance.id)
                })
            }
            // convert legislations to ids before saving
            $scope.case.legislationsReferedToIds = []
            if ($scope.case.legislationsReferedTo !== undefined || $scope.case.legislationsReferedTo.length > 0) {
                $scope.case.legislationsReferedTo.map(function(legislation) {
                    $scope.case.legislationsReferedToIds.push(legislation._id ? legislation._id : legislation.id)
                })
            }

            // convert case references from cases to ids before saving

            $scope.case.casesReferedToIds = []
            if ($scope.case.casesReferedTo !== undefined || $scope.case.casesReferedTo.length > 0) {
                $scope.case.casesReferedTo.map(function(caseInstance) {
                    $scope.case.casesReferedToIds.push(caseInstance._id ? caseInstance._id : caseInstance.id)
                })
            }

            // convert work references from work to ids fore saving
            $scope.case.workReferedToIds = []
            if ($scope.case.workReferedTo !== undefined || $scope.case.workReferedTo.length > 0) {
                $scope.case.workReferedTo.map(function(work) {
                    $scope.case.workReferedToIds.push(work._id ? work._id : work.id)
                })
            }

            $scope.case.legislationsReferedTo = undefined
            $scope.case.casesReferedTo = undefined
            $scope.case.workReferedTo = undefined
            $scope.case.areasOfLaw = undefined
            Case.upsert($scope.case,
                function(res) {
                    /*
                      $scope.case.legislationsReferedTo.forEach(function(legislation){
                        CaseLegislations.create({
                          caseId: aCase.id,
                          legislationId: legislation.id
                        }, function(res){}, function(err){})

                      })

                      $scope.case.casesReferedTo.forEach(function(reference){
                        CaseCases.create({
                          caseId: aCase.id,
                          caseReferedToId: reference.id
                        }, function(res){}, function(err){})

                      })

                      $scope.case.workReferedTo.forEach(function(reference){
                        CaseWorks.create({
                          caseId: aCase.id,
                          workId: reference.id
                        }, function(res){}, function(err){})

                      })

                      */

                    $scope.saveStatus = 2
                    setTimeout(function() {
                        $scope.saveStatus = 0
                        $('#applicationForm').click()
                    }, 10000)

                    console.info($scope.case.isNew)

                    if ($scope.case.isNew == true) {
                        $scope.cases.push(aCase)
                    }

                    $scope.openCase(res.data)
                },
                function(errorResponse) {}
            )
        }

        $scope.generateName = function(aCase) {
            console.log(aCase)
            aCase.accuser = ''
            aCase.accused = ''
            if (aCase.plaintiffs.length > 1) {
                aCase.accuser = aCase.plaintiffs[0].name + ' and Others'
            } else {
                aCase.accuser = aCase.plaintiffs[0].name
            }

            if (aCase.defendants.length > 1) {
                aCase.accused = aCase.defendants[0].name + ' and Others'
            } else {
                aCase.accused = aCase.defendants[0].name
            }

            return aCase.name = aCase.accuser + ' Vs. ' + aCase.accused
        }

        /*

        $scope.openCase = function(aCase){

             $scope.case = aCase
             $('#addCaseModal').modal()
             $scope.viewMode = true
             Case.find({
               filter:{include: [{
                 relation: 'plaintiffSynonym', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['synonym'] // only show two fields
                 }},
                 {relation: 'defendantSynonym', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['synonym'] // only show two fields
                 }},
                 {relation: 'court', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['name'] // only show two fields
                 }},
                 {relation: 'location', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['name'] // only show two fields
                 }},
                 {relation: 'jurisdiction', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['name'] // only show two fields
                 }},
                 {relation: 'legislationsReferedTo', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['legislationName'] // only show two fields
                 }},
                 {relation: 'casesReferedTo', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['plaintiffs','defendants'] // only show two fields
                 }},
                 {relation: 'workReferedTo', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['name'] // only show two fields
                 }},
                 {relation: 'areaOfLaw', // include the owner object
                 scope: { // further filter the owner object
                   fields: ['name'] // only show two fields
                 }}
               ],

               where: {
                 id: aCase.id
               }
               }},
               function(res) {
                 var instance = res.data[0]
                 console.info("Returned: ", instance)
                  angular.forEach(instance, function(value, key){
                    $scope.case[key] = value
                  })

                 $scope.case.isNew = false
                 $scope.case.citation.year = parseInt($scope.case.citation.year)

                 //Generate Names for Reference Field in view

                 $scope.case.casesReferedTo.forEach(function(reference){
                   reference.name=$scope.generateName(reference)
                   //console.info("Case reference",  reference)
                 })

                 $scope.returned = true

               },
               function(errorResponse) { }
             )

        }

        */

        $scope.openCase = function(caseInstance) {
            Case.viewCase({ id: caseInstance.id }, function(res) {
                $scope.case = res.data.cases
                $scope.case.workReferedTo = $scope.case.workReferences ? $scope.case.workReferences : $scope.case.workReferedTo
                    // $('#addCaseModal').modal('show')
                $('#addCaseModal').appendTo('body').modal('show')
                $scope.viewMode = true
                $scope.case.isNew = false; // Don't add to the cases list view
            })
        }

        $scope.addCaseReference = function(aCase) {
            $scope.case.casesReferedTo.push(aCase)
        }

        $scope.addLegislationReference = function(legislation) {
            $scope.case.legislationsReferedTo.push(legislation)
        }

        $scope.addWorkReference = function(work) {
            console.log(work)
            $scope.case.workReferedTo.push(work)
        }

        $scope.saveReview = function() {
            $('#caseReviewModal').modal('hide')
        }

        $scope.gettingCaseReferences = false
        $scope.gettingLegislationReferences = false
        $scope.gettingWorkReferences = false
        $scope.gettingCases = false

        /*$scope.$watch('query', function () {
             if($scope.query.length < 5){
                 $scope.gettingCases = false
                 $scope.cases = []

             }
             else if($scope.query.length >= 5 &&  $scope.gettingCases == false){
                 $scope.gettingCases = true
                 $scope.cases = Case.find({
                            filter:{fields:{
                               name:true,
                               id:true

                            }

                          }},
                            function(work) {},
                            function(error){}
                )

             }

         })

         */

        $scope.$watch('queries.caseReferencesQuery', function() {
            if ($scope.queries.caseReferencesQuery) {
                $scope.gettingCaseReferences = false

                var term = $scope.queries.caseReferencesQuery
                if ($scope.gettingCaseReferences == false && term.length > 3) {
                    console.log(term)
                    $scope.gettingCaseReferences = true
                    Case.flexisearch({ term: term },
                        function(res) {
                            $scope.caseReferences = res.data.cases
                            console.log('res', $scope.caseReferences)
                                /* $scope.caseReferences.forEach(function(ref) {
                                     ref.year = new Date(ref.dateOfAssent).getFullYear()
                                     ref.legislationNumbers = ref.legislationNumbers ? ref.legislationNumbers : ref.legislationNumber
                                         // console.log(parent.year)
                                 })*/
                            $scope.gettingCaseReferences = false
                        },
                        function(errorResponse) {}
                    )
                }
            }
        })

        $scope.$watch('queries.legislationReferencesQuery', function() {
            if ($scope.queries.legislationReferencesQuery) {
                $scope.gettingLegislationReferences = false

                var term = $scope.queries.legislationReferencesQuery
                if ($scope.gettingLegislationReferences == false && term.length > 3) {
                    console.log(term)
                    $scope.gettingLegislationReferences = true
                    Legislation.flexisearch({ term: term },
                        function(res) {
                            $scope.legislationReferences = res.data.legislations
                            console.log('res', $scope.legislationReferences)
                            $scope.legislationReferences.forEach(function(ref) {
                                ref.year = new Date(ref.dateOfAssent).getFullYear()
                                ref.legislationNumbers = ref.legislationNumbers ? ref.legislationNumbers : ref.legislationNumber
                                    // console.log(parent.year)
                            })
                            $scope.gettingLegislationReferences = false
                        },
                        function(errorResponse) {}
                    )
                }
            }
        })

        $scope.$watch('queries.workReferencesQuery', function() {
            if ($scope.queries.workReferencesQuery) {
                $scope.gettingWorkReferences = false

                var term = $scope.queries.workReferencesQuery
                if ($scope.gettingWorkReferences == false && term.length > 3) {
                    console.log(term)
                    $scope.gettingWorkReferences = true
                    Work.flexisearch({ term: term },
                        function(res) {
                            $scope.workReferences = res.data.works
                            console.log('res', $scope.workReferences)
                            $scope.gettingWorkReferences = false
                        },
                        function(errorResponse) {}
                    )
                }
            }
        })

        $scope.createAreaOfLaw = function(event) {
            if (event.which === 13) {
                console.log(area)
            }
        }
    })

var openAddAreaOfLaw = function() {
    // $("#addAreaOfLawModal").modal()
    // console.log("opened")
    $('#addAreaOfLawModal').appendTo('body').modal('show')
}

var openAddCourt = function() {
    // $("#addAreaOfLawModal").modal()
    $('#addCourtModal').appendTo('body').modal('show')
}

var openAddLegislation = function() {
    // $("#addAreaOfLawModal").modal()
    $('#addLegislationModal').appendTo('body').modal('show')
}