'use strict'
angular.module('apptorney')
    .filter('dateSuffix', function($filter) {
        var suffixes = ['th', 'st', 'nd', 'rd']
        return function(input) {
            var dtfilter = $filter('date')(input, 'dd')
            var day = parseInt(dtfilter.slice(-2))
            var relevantDigits = (day < 30) ? day % 20 : day % 30
            var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0]
            return dtfilter + suffix
        }
    })
    .controller('LegislationController', function($rootScope, $scope, $filter, Legislation, LegislationType, LegislationPart, PartType, $location, $global, datetime, $routeParams, filterFilter, baseURL, Papa, $q) {
        $scope.currentPage = 1
        $scope.selectedType = ''
        $scope.selected = false
        $scope.opened = true
        $scope.legislation = {}
        $scope.legislation.amendedLegislations = []
        $scope.legislation.replacedLegislations = []
        $scope.legislation.repealedLegislations = []
        $scope.legislationPart = {}
        $scope.returned = false
        $scope.showLegislations = false
        $scope.message = 'Loading...'
        $scope.legislationTypesReturned = false
        $scope.showLegislationTypes = false
        $scope.legislationType = {}
        $scope.legislationPartType = {}
        $scope.legislationPartTypesReturned = false
        $scope.showLegislationPartTypes = false
        $scope.saveStatus = 0
        $scope.baseURL = baseURL.replace('/api/', '') // Hack to show images and file links in Legislation
        $scope.parents = []
        $scope.mergeStatus = 0
        $scope.queries = {}
        $scope.legislationReferences = []

        $scope.loadLegislationTypes = function() {
            LegislationType.find(
                function(res) {
                    $scope.legislationTypes = res.data
                    $scope.legislationTypesReturned = true
                    $scope.showLegislationTypes = true
                },
                function(errorResponse) {}
            )
        }

        $scope.loadLegislationPartTypes = function() {
            PartType.find(
                function(res) {
                    $scope.legislationPartTypes = res.data
                    $scope.legislationPartTypesReturned = true
                    $scope.showLegislationPartTypes = true
                },
                function(errorResponse) {}
            )
        }

        $scope.loadLegislationTypes()
        $scope.loadLegislationPartTypes()

        $scope.saveLegislationType = function() {
            LegislationType.upsert($scope.legislationType,
                function(legislationType) {
                    $scope.legislationTypes.push(legislationType)
                },
                function(errorResponse) {}
            )

            $('#addLegislationTypeModal').modal('hide')
        }

        $scope.saveLegislationPartType = function() {
            PartType.upsert($scope.legislationPartType,
                function(legislationPartType) {
                    $scope.legislationPartTypes.push(legislationPartType)
                },
                function(errorResponse) {}
            )

            $('#addLegislationPartType').modal('hide')
        }

        $scope.typeSelected = function(typeOfLegislation) {
            $scope.selected = true
            $scope.legislation.legislationType = typeOfLegislation.id
            $scope.selectedType = typeOfLegislation.name
        }

        $scope.saveLegislation = function() {
            $scope.saveStatus = 1
            $scope.legislation.generalTitle = 'Government of Zambia'
            console.log($rootScope.user)
            if ($scope.legislation.completionStatus == true) {
                $scope.legislation.capturedById = $rootScope.user.id
            }

            $scope.legislation.replacedLegislationIds = []
            $scope.legislation.amendedLegislationIds = []
            $scope.legislation.repealedLegislationIds = []

            $scope.legislation.amendedLegislations.map(function(legislation) {
                $scope.legislation.amendedLegislationIds.push(legislation.id)
            })

            $scope.legislation.replacedLegislations.map(function(legislation) {
                $scope.legislation.replacedLegislationIds.push(legislation.id)
            })

            $scope.legislation.repealedLegislations.map(function(legislation) {
                $scope.legislation.repealedLegislationIds.push(legislation.id)
            })

            $scope.legislation.amendedLegislations = undefined
            $scope.legislation.replacedLegislations = undefined
            $scope.legislation.repealedLegislations = undefined

            Legislation.upsert($scope.legislation,
                    function(res) {
                        var legislation = res.data
                        $scope.saveStatus = 2
                        setTimeout(function() {
                            $scope.saveStatus = 0
                            console.log('Save Status = ' + $scope.saveStatus)
                            $('#applicationForm').click()
                        }, 10000)
                        $scope.openLegislation(legislation)
                    },
                    function(errorResponse) {}
                )
                // $scope.legislations.push($scope.legislation)

            // $("#addLegislationModal").modal("hide")

        }

        $scope.deleteLegislation = function(legislationID) {
            Legislation.deleteById({ id: legislationID })
                .$promise
                .then(function() {
                    // console.log('deleted')
                    $scope.legislations.forEach(function(legislation) {
                        if (legislation.id == legislationID) {
                            $scope.legislations.splice($scope.legislations.indexOf(legislation), 1)
                        }
                    })
                })
        }

        $scope.deleteLegislationType = function(legislationTypeID) {
            LegislationType.deleteById({ id: legislationTypeID })
                .$promise
                .then(function() {
                    // console.log('deleted')
                    $scope.legislationTypes.forEach(function(legislationType) {
                        if (legislationType.id == legislationTypeID) {
                            $scope.legislationTypes.splice($scope.legislationTypes.indexOf(legislationType), 1)
                        }
                    })
                })
        }

        $scope.deleteLegislationPartType = function(legislationPartTypeID) {
            PartType.deleteById({ id: legislationPartTypeID })
                .$promise
                .then(function() {
                    // console.log('deleted')
                    $scope.legislationPartTypes.forEach(function(legislationPartType) {
                        if (legislationPartType.id == legislationPartTypeID) {
                            $scope.legislationPartTypes.splice($scope.legislationPartTypes.indexOf(legislationPartType), 1)
                        }
                    })
                })
        }

        $scope.deleteLegislation = function(legislation) {
            bootbox.confirm({
                message: 'Are you sure you want to delete the legislation <strong>' + legislation.legislationName + '</strong>?',
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
                    if (result == true) {
                        legislation.deletedBy = $rootScope.user.id
                        legislation.deletedOn = Date.now()
                        legislation.deleted = true
                            // legislation.deleteFlag = 1 //Used to notify API that delete button has been clicked

                        Legislation.upsert(legislation,
                            function(deleted) {
                                console.log('Deletion was Successful')
                                $scope.legislations.splice($scope.legislations.indexOf(legislation), 1)
                            },
                            function(error) {}
                        )

                        console.log('This was logged in the callback: ' + result)
                    } else {
                        console.log('deletion cancelled')
                    }
                }
            })
        }

        $scope.loadLegislations = function(type) {
            $scope.sortType = 'legislationName'
            $scope.returned = false
            $scope.showLegislations = false
            if (type == 'all') {
                Legislation.viewLegislations({ type: $routeParams.id, term: $scope.currentPage - 1 },
                    function(res) {
                        $scope.legislations = res.data.legislations
                        $scope.numberOfItemsPerPage = 200
                        $scope.totalItems = $scope.query ? res.data.legislations.length : res.data.count
                            // $scope.legislations = filterFilter($scope.legislations, $routeParams.id)
                        $scope.returned = true
                        $scope.showLegislations = true

                        $scope.completedLegislations = []
                        $scope.legislations.forEach(function(legislation) {
                            if (legislation.completionStatus == true) {
                                $scope.completedLegislations.push(legislation)
                            }
                        })
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'search') {
                Legislation.search({ term: $scope.query, type: $routeParams.id },
                    function(res) {
                        $scope.legislations = res.data.legislations
                        $scope.numberOfItemsPerPage = 200
                        $scope.totalItems = $scope.query ? res.data.legislations.length : res.data.count
                            // $scope.legislations = filterFilter($scope.legislations, $routeParams.id)
                        $scope.returned = true
                        $scope.showLegislations = true

                        $scope.completedLegislations = []
                        $scope.legislations.forEach(function(legislation) {
                            if (legislation.completionStatus == true) {
                                $scope.completedLegislations.push(legislation)
                            }
                        })
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'duplicates') {
                Legislation.getDuplicates({ limit: 100, skip: $scope.currentPage - 1, /*query:$scope.query*/ type: $routeParams.id },
                    function(res) {
                        $scope.legislations = res.data.duplicates
                        $scope.numberOfItemsPerPage = res.data.duplicates.length
                        $scope.totalItems = res.data.uniqueCount
                            // $scope.legislations = filterFilter($scope.legislations, $routeParams.id)
                        $scope.returned = true
                        $scope.showLegislations = true

                        $scope.completedLegislations = []
                        $scope.legislations.forEach(function(legislation) {
                            if (legislation.completionStatus == true) {
                                $scope.completedLegislations.push(legislation)
                            }
                        })
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'occurences') {
                Legislation.namesakes({ id: JSON.stringify($rootScope.legislation.uniqueIds), type: $routeParams.legislationTypeID },
                    function(res) {
                        console.log(res.data)
                        $scope.legislations = res.data.namesakes
                        $scope.returned = true
                        $scope.showLegislations = true

                        $scope.completedLegislations = []
                        $scope.legislations.forEach(function(legislation) {
                            if (legislation.completionStatus == true) {
                                $scope.completedLegislations.push(legislation)
                            }
                        })
                    },
                    function(errorResponse) {}
                )
            } else if (type == 'trash') {
                console.log('Loading trash...')
                Legislation.viewTrash(
                    function(res) {
                        console.log(res.data)
                        $scope.legislations = res.data.trash
                        $scope.returned = true
                        $scope.showLegislations = true

                        $scope.completedLegislations = []
                        $scope.legislations.forEach(function(legislation) {
                            if (legislation.completionStatus == true) {
                                $scope.completedLegislations.push(legislation)
                            }
                        })
                    },
                    function(errorResponse) {}
                )
            }
        }

        console.log($location.path())

        if ($location.path().indexOf('/legislations/') !== -1) {
            // $scope.loadLegislations('all')
        } else if ($location.path().indexOf('/cleanup/detail/1/1') !== -1) {
            $scope.loadLegislations('occurences')
        } else if ($location.path().indexOf('/cleanup/') !== -1) {
            $scope.loadLegislations('duplicates')
        } else if ($location.path() == '/trash/legislations') {
            $scope.loadLegislations('trash')
        } else {
            console.log('No match', $location.path())
            $scope.loadLegislations('occurences')
        }

        $scope.$watch('currentPage', function() {
            $scope.legislations = []
                /*if($location.path().indexOf("/cleanup/") !== -1){
                  console.log("watching.....")
                  $scope.loadLegislations("duplicates")
                }*/
            if ($location.path() == '/trash/legislations') {
                $scope.loadLegislations('trash')
            } else if ($location.path().indexOf('/legislations') !== -1) {
                $scope.loadLegislations('all')
            }
        })

        $scope.searchForLegislations = function(event) {
            console.log('Searching for ', $scope.query)
            $scope.legislations = []
            $scope.returned = false
            $scope.showLegislations = false
            $scope.message = 'Searching...'
        }

        $scope.$watch('query', function() {
            console.log($scope.query)

            if ($location.path().indexOf('/legislation') !== -1 && $scope.query !== undefined) {
                // $scope.message = "Searching..."
                // $scope.loadLegislations("all")
                console.log('Searching...')
                $scope.loadLegislations('search')
            }
        })

        $scope.newLegislation = function() { // fires when user opens the create modal for the first time
            $scope.legislation = {}
            $scope.legislation.legislationParts = []
            $scope.selected = false
            $scope.showParts = true
        }

        $scope.openLegislation = function(legislation) {
            console.log(legislation)
            $scope.opened = false
            $('#legislationModal').modal()
            $scope.models = {
                selected: null
            }

            $scope.viewMode = true
            Legislation.find({
                    filter: {
                        where: {
                            id: legislation.id
                        }
                    }
                },
                function(list) {
                    angular.forEach($scope.legislation, function(value, key) {
                        $scope.legislation[key] = undefined
                    })

                    var instance = list.data[0]

                    angular.forEach(instance, function(value, key) {
                        $scope.legislation[key] = value
                    })

                    $scope.legislationTypes.forEach(function(type) {
                        if (type.id == $scope.legislation.legislationType) {
                            $scope.selected = true
                            $scope.selectedType = type.name
                        }
                    })
                    if (typeof $scope.legislation.dateOfAssent == 'string') {
                        $scope.legislation.dateOfAssent = $scope.legislation.dateOfAssent.substring(0, 10)
                        var parser = datetime('yyyy-MM-dd')

                        $scope.legislation.dateOfAssent = parser.parse($scope.legislation.dateOfAssent).getDate()
                    }
                    $scope.opened = true

                    // $scope.showLegislations = true
                },
                function(errorResponse) {}
            )

            $scope.showParts = true
            $scope.parts_returned = true

            /*$scope.legislationParts =  Legislation.legislationParts({id:legislation.id, filter: {order: 'orderIndex ASC'}},
              function(parts) {
                //var i = 0
                parts.forEach(function(part){
                  part.viewMode = false
                  part.orderIndex = parseInt(part.orderIndex)

                  //part.orderIndex = i
                  //i++
                })

                $scope.showParts = true
                $scope.parts_returned = true
                $scope.opened = true
                //$filter('orderBy')(parts,'orderIndex')

              },
              function(errorResponse) { }
            ); */

        }

        $scope.openLegislationType = function(legislationType) {
            $scope.legislationType = legislationType
        }

        $scope.openLegislationPartType = function(legislationPartType) {
            $scope.legislationPartType = legislationPartType
        }

        $scope.selectedPartType = ''
        $scope.partTypeSelected = false
        $scope.selectPartType = function(type) {
            $scope.partTypeSelected = true
            $scope.legislationPart.partType = type.id
            $scope.selectedPartType = type.name
            console.log($scope.legislationPart)
        }
        $scope.legislationPart = {}
        $scope.legislationParts = []

        $scope.addLegislationPart = function() {
            $scope.legislation.legislationParts.push({ title: 'PART ' + $scope.romanize($scope.legislation.legislationParts.length + 1) })
                // $("#addLegislationPart").modal("hide")
            console.log($scope.legislation.legislationParts)
        }

        $scope.openAddLegislationPartModal = function() {
            // $scope.legislationPart = new Object()
        }

        $scope.toggleView = function() {
            if ($scope.viewMode == false) {
                $scope.viewMode = true
            } else {
                $scope.viewMode = false
            }
        }

        $scope.$watch('legislationParts', function(model) {
            // $scope.modelAsJson = angular.toJson(model, true)
            // $scope.legislationParts = model
            // console.log($scope.opened)
            /*if($scope.opened){
              var i = 0
              $scope.legislationParts.forEach(function(part){
                part.orderIndex = i
                i++
              })
              console.log(angular.toJson(model, true))
            }*/

        }, true)

        $scope.reOrder = function(index) {
            // console.log(index)
            $scope.legislationParts.splice(index, 1)
            var i = 0
            $scope.legislationParts.forEach(function(part) {
                part.orderIndex = i
                i++
            })

            // console.log(angular.toJson($scope.legislationParts, true))

        }

        $scope.editPart = function(scope) {
            $scope.legislationPart = scope.$modelValue
            if ($scope.legislationPart.table == undefined) {
                $scope.legislationPart.showTable = false
            } else {
                // $scope.legislationPart.tableHeaders = Object.keys($scope.legislationPart.table[0])
                $scope.legislationPart.showTable = true
            }
        }

        $scope.romanize = function(num) {
            if (!+num)
                return false
            var digits = String(+num).split(''),
                key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
                    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
                    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
                ],
                roman = '',
                i = 3
            while (i--)
                roman = (key[+digits.pop() + (i * 10)] || '') + roman
            return Array(+digits.join('') + 1).join('M') + roman
        }

        $scope.addTable = function() {
            $scope.legislationPart.showTable = true
            if ($scope.legislationPart.table == undefined) {
                $scope.legislationPart.table = {}
                $scope.legislationPart.table.content = [{}]
                $scope.legislationPart.table.tableHeaders = ['column1', 'column2', 'column3']
                $scope.legislationPart.table.title = 'Table Heading'
            }
        }

        $scope.showDuplicatesDetail = function(legislation) {
            $rootScope.legislation = legislation
            $location.path('/cleanup/detail/1/1')
        }

        $scope.uploadTable = function($files) {
            if ($files !== null && $files.length > 0) {
                $scope.loading = true
                $scope.message = 'Generating table. Please wait...'

                var message = 'Thanks for '
                for (var file in $files) {
                    console.log('files', $files[file])

                    Papa.parse($files[file], { header: true })
                        .then(function(result) {
                            var headers = []
                            angular.forEach(result.data[0], function(value, key) {
                                headers.push(key)
                            })
                            console.log(result.data)
                            $scope.legislationPart.table = {
                                content: result.data,
                                tableHeaders: headers
                            }
                            $scope.loading = false
                            $scope.legislationPart.attachmentType = 'table'
                            $scope.legislationPart.showTable = true

                            console.log($scope.legislationPart)
                        })
                        .catch(function() {})
                        .finally(function() {})
                }
            }
        }

        $scope.mergeDuplicates = function() {
            $scope.mergeStatus = 1

            Legislation.mergeDuplicates({ id: JSON.stringify($rootScope.legislation.uniqueIds), primary: $scope.legislation.id },
                function(res) {
                    console.log('Merged Legislations For: ' + $scope.legislation.legislationName)
                    $scope.mergeStatus = 2
                    $scope.legislations = filterFilter($scope.legislations, $scope.legislation.id)
                        // $scope.legislation = undefined

                },
                function(err) {
                    console.error('Error occured')
                }
            )
        }

        $scope.searchForParent = function(term) {
            Legislation.flexisearch({ term: term },
                function(res) {
                    $scope.parents = res.data.legislations
                    $scope.parents.forEach(function(parent) {
                        parent.year = new Date(parent.dateOfAssent).getFullYear()
                        parent.legislationNumbers = parent.legislationNumbers ? parent.legislationNumbers : parent.legislationNumber
                            // console.log(parent.year)
                    })
                },
                function(errorResponse) {}
            )
        }

        $scope.restoreLegislation = function(legislation) {
            bootbox.confirm({
                message: 'Are you sure you want to restore the legislation <strong>' + legislation.legislationName + '</strong>?',
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-primary'
                    }
                },
                callback: function(result) {
                    if (result == true) {
                        Legislation.restoreFromTrash({ id: legislation.id },
                            function(res) {
                                console.log('Restored: ', res)
                                $scope.legislations.splice($scope.legislations.indexOf(legislation), 1)
                            }
                        )
                        console.log('This was logged in the callback: ' + result)
                    } else {
                        console.log('deletion cancelled')
                    }
                }
            })
        }

        $scope.markAsEnglish = function(legislation) {
            legislation.legislationType = '598978adbe0d4f0197376605'
            Legislation.upsert(legislation,
                function(res) {
                    console.log('Returned Data', res.data)
                    $scope.legislations.splice($scope.legislations.indexOf(legislation), 1)
                },
                function(errorResponse) {}
            )
        }

        $scope.$watch('queries.legislationReferencesQuery', function() {
            $scope.gettingLegislationReferences = false

            var term = $scope.queries.legislationReferencesQuery
            if ($scope.gettingLegislationReferences == false && term.length > 3) {
                console.log(term)
                $scope.gettingLegislationReferences = true
                Legislation.flexisearch({ term: term },
                    function(res) {
                        $scope.legislationReferences = res.data.legislations
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
        })

        $scope.addAmendedLegislations = function(legislation) {
            // $scope.legislation.amendingLegislations = []
            $scope.legislation.amendedLegislations.push(legislation)
        }

        $scope.addReplacedLegislations = function(legislation) {
            // $scope.legislation.amendingLegislations = []
            $scope.legislation.replacedLegislations.push(legislation)
        }

        $scope.addRepealedLegislations = function(legislation) {
            // $scope.legislation.amendingLegislations = []
            console.log(legislation)
            $scope.legislation.repealedLegislations = ($scope.legislation.repealedLegislations == undefined) ? [] : $scope.legislation.repealedLegislations
            $scope.legislation.repealedLegislations.push(legislation)
        }

        $scope.openAmendedLegislation = function() {
            $scope.legislationReferences = []
            $scope.queries.legislationReferencesQuery = ''
            $('#amendedLegislationsModal').modal()
        }
        $scope.openReplacedLegislation = function() {
            $scope.legislationReferences = []
            $scope.queries.legislationReferencesQuery = ''
            $('#replacedLegislationsModal').modal()
        }

        $scope.openRepealedLegislation = function() {
            $scope.legislationReferences = []
            $scope.queries.legislationReferencesQuery = ''
            $('#repealedLegislationsModal').modal() //
        }
    })