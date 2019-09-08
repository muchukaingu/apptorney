'use strict'

angular
    .module('themesApp', [
        'easypiechart',
        'toggle-switch',
        'ui.bootstrap',
        'ui.tree',
        'ui.select',
        'ngGrid',
        'xeditable',
        'flow',
        'theme.services',
        'theme.directives',
        'apptorney',
        'apiServices',
        'datetime',
        'theme.navigation-controller',
        'theme.notifications-controller',
        'theme.messages-controller',
        'theme.colorpicker-controller',
        'theme.layout-horizontal',
        'theme.layout-boxed',
        'theme.calendars',
        'theme.gallery',
        'theme.tasks',
        'theme.ui-tables-basic',
        'theme.ui-panels',
        'theme.ui-ratings',
        'theme.ui-modals',
        'theme.ui-tiles',
        'theme.ui-alerts',
        'theme.ui-sliders',
        'theme.ui-progressbars',
        'theme.ui-paginations',
        'theme.ui-carousel',
        'theme.ui-tabs',
        'theme.ui-nestable',
        'theme.form-components',
        'theme.form-directives',
        'theme.form-validation',
        'theme.form-inline',
        'theme.form-image-crop',
        'theme.form-uploads',
        'theme.tables-ng-grid',
        'theme.tables-editable',
        'theme.charts-flot',
        'theme.charts-canvas',
        'theme.charts-svg',
        'theme.charts-inline',
        'theme.pages-controllers',
        'theme.dashboard',
        'theme.templates',
        'theme.template-overrides',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'dndLists',
        'angularFileUpload',
        'papa-promise',
        'ngFileUpload',
        'environment'
    ])
    .factory('myInterceptor', function($q) {
        return {
            // intercept the requests on the way out.
            request: function(config) {
                config.headers['X-IBM-Client-ID'] = '4449615d-b5b2-4e16-a059-f6bda4486953';
                config.headers['X-IBM-Client-Secret'] = '81ed3948-6ca5-4936-be0b-5db9aec1107b';
                return config;
            }
        }
    })
    .controller('MainController', ['$rootScope', '$scope', '$global', '$timeout', 'progressLoader', '$location', 'Appuser', function($rootScope, $scope, $global, $timeout, progressLoader, $location, Appuser) {
        $scope.style_fixedHeader = $global.get('fixedHeader')
        $scope.style_headerBarHidden = $global.get('headerBarHidden')
        $scope.style_layoutBoxed = $global.get('layoutBoxed')
        $scope.style_fullscreen = $global.get('fullscreen')
        $scope.style_leftbarCollapsed = $global.get('leftbarCollapsed')
        $scope.style_leftbarShown = $global.get('leftbarShown')
        $scope.style_rightbarCollapsed = $global.get('rightbarCollapsed')
        $scope.style_isSmallScreen = false
        $scope.style_showSearchCollapsed = $global.get('showSearchCollapsed')
        $scope.style_layoutHorizontal = $global.get('layoutHorizontal')

        $scope.hideSearchBar = function() {
            $global.set('showSearchCollapsed', false)
        }

        $scope.hideHeaderBar = function() {
            $global.set('headerBarHidden', true)
        }

        $scope.showHeaderBar = function($event) {
            $event.stopPropagation()
            $global.set('headerBarHidden', false)
        }

        $scope.toggleLeftBar = function() {
            if ($scope.style_isSmallScreen) {
                return $global.set('leftbarShown', !$scope.style_leftbarShown)
            }
            $global.set('leftbarCollapsed', !$scope.style_leftbarCollapsed)
        }

        $scope.toggleRightBar = function() {
            $global.set('rightbarCollapsed', !$scope.style_rightbarCollapsed)
        }

        $scope.$on('globalStyles:changed', function(event, newVal) {
            $scope['style_' + newVal.key] = newVal.value
        })
        $scope.$on('globalStyles:maxWidth767', function(event, newVal) {
            $timeout(function() {
                $scope.style_isSmallScreen = newVal
                if (!newVal) {
                    $global.set('leftbarShown', false)
                } else {
                    $global.set('leftbarCollapsed', false)
                }
            })
        })

        // there are better ways to do this, e.g. using a dedicated service....
        // but for the purposes of this demo this will do :P
        if (Appuser.isAuthenticated()) {
            $rootScope.isLoggedIn = true
        }

        $scope.logIn = function() {
            $location.path('/login')
        }

        $scope.logOut = function() {
            Appuser.logout().$promise.then(function() {
                $rootScope.isLoggedIn = false
                $location.path('/login')
            })
        }

        $scope.rightbarAccordionsShowOne = false
        $scope.rightbarAccordions = [{ open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }]

        $scope.$on('$routeChangeStart', function(e) {
            // console.log('start: ', $location.path())
            progressLoader.start()
            progressLoader.set(50)
        })
        $scope.$on('$routeChangeSuccess', function(e) {
            // console.log('success: ', $location.path())
            progressLoader.end()
        })
    }])
    .config(['$provide', '$routeProvider', 'LoopBackResourceProvider', '$httpProvider', 'envServiceProvider', function($provide, $routeProvider, LoopBackResourceProvider, $httpProvider, envServiceProvider) {
        $httpProvider.defaults.headers.common['X-IBM-Client-ID'] = '4449615d-b5b2-4e16-a059-f6bda4486953'
        $httpProvider.defaults.headers.common['X-IBM-Client-Secret'] = '81ed3948-6ca5-4936-be0b-5db9aec1107b'
        $httpProvider.interceptors.push('myInterceptor');

        envServiceProvider.config({
            domains: {
                development: ['localhost'],
                // production: ['apptorney-cms.eu-gb.mybluemix.net'],
                production: ['apptorney.circuitbusiness.com'],
                test: ['apptorney-frontend-test.eu-gb.mybluemix.net'],
                staging: ['apptorney-frontend-staging.eu-gb.mybluemix.net'],
                // anotherStage: ['domain1', 'domain2'] 
            },
            vars: {
                development: {
                    apiUrl: '//localhost:3009/api'
                },
                test: {
                    apiUrl: '//apptorney-backend-test.eu-gb.mybluemix.net/api',
                    clientID: 'e7aebcd3-ea44-4b68-89e7-821817a1b5f6',
                    clientSecret: 'fb67bc04-b06d-402f-be8b-d4969279b11b'
                },
                production: {
                    apiUrl: '//apptorney-api.eu-gb.mybluemix.net/api',
                    clientID: '4449615d-b5b2-4e16-a059-f6bda4486953',
                    clientSecret: '81ed3948-6ca5-4936-be0b-5db9aec1107b'
                },
                staging: {
                    apiUrl: '//apptorney-backend-test.eu-gb.mybluemix.net/api',
                    clientID: 'e7aebcd3-ea44-4b68-89e7-821817a1b5f6',
                    clientSecret: 'fb67bc04-b06d-402f-be8b-d4969279b11b'
                },
                defaults: {
                    apiUrl: '//api.default.com/v1',
                    staticUrl: '//static.default.com'
                }
            }
        })

        // run the environment check, so the comprobation is made 
        // before controllers and services are built 
        envServiceProvider.check()
        console.log(envServiceProvider.read('apiUrl'))

        // Set API Auth

        $httpProvider.defaults.headers.common['X-IBM-Client-ID'] = envServiceProvider.read('clientID')
        $httpProvider.defaults.headers.common['X-IBM-Client-Secret'] = envServiceProvider.read('clientSecret')

        // Change the URL where to access the LoopBack REST API server
        LoopBackResourceProvider.setUrlBase(envServiceProvider.read('apiUrl')); // Important: Comment for test
        // LoopBackResourceProvider.setUrlBase('http://circuit.cloudapp.net:3001/api'); //Important: Comment for test
        // LoopBackResourceProvider.setUrlBase('http://circuitbusiness-test.cloudapp.net:3001/api'); //Important: Comment for production
        // LoopBackResourceProvider.setUrlBase('http://localhost:3009/api'); //Important: Comment for production

        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html'
            })
            .when('/dashboard', {
                templateUrl: 'views/index.html'
            })
            .when('/cases/:year', {
                templateUrl: 'views/cases.html'
            })
            .when('/cleanup-cases', {
                templateUrl: 'views/duplicates-cases.html'
            })
            .when('/cleanup-cases/detail', {
                templateUrl: 'views/duplicates-cases-detail.html'
            })
            .when('/works', {
                templateUrl: 'views/works.html'
            })
            .when('/trash/cases', {
                templateUrl: 'views/trash-cases.html'
            })
            .when('/trash/legislations', {
                templateUrl: 'views/trash-legislations.html'
            })
            .when('/cleanup', {
                templateUrl: 'views/duplicates.html'
            })
            .when('/cleanup/:id', {
                templateUrl: 'views/duplicates.html'
            })
            .when('/cleanup/detail/:legislationTypeID/:legislationID', {
                templateUrl: 'views/duplicates-detail.html'
            })
            .when('/courts', {
                templateUrl: 'views/courts.html'
            })
            .when('/jurisdictions', {
                templateUrl: 'views/jurisdictions.html'
            })
            .when('/locations', {
                templateUrl: 'views/locations.html'
            })
            .when('/areasOfLaw', {
                templateUrl: 'views/areas-of-law.html'
            })
            .when('/legislations/:id', {
                templateUrl: 'views/legislations.html'
            })
            .when('/legislationparttypes', {
                templateUrl: 'views/legislation-part-types.html'
            })
            .when('/legislationtypes', {
                templateUrl: 'views/legislation-types.html'
            })
            .when('/plaintiffsynonyms', {
                templateUrl: 'views/plaintiff-synonyms.html'
            })
            .when('/defendantsynonyms', {
                templateUrl: 'views/defendant-synonyms.html'
            })
            .when('/calendar', {
                templateUrl: 'views/calendar.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'assets/plugins/fullcalendar/fullcalendar.js'
                        ])
                    }]
                }
            })
            .when('/form-ckeditor', {
                templateUrl: 'views/form-ckeditor.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'assets/plugins/form-ckeditor/ckeditor.js',
                            'assets/plugins/form-ckeditor/lang/en.js'
                        ])
                    }]
                }
            })
            .when('/form-imagecrop', {
                templateUrl: 'views/form-imagecrop.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'assets/plugins/jcrop/js/jquery.Jcrop.js'
                        ])
                    }]
                }
            })
            .when('/form-wizard', {
                templateUrl: 'views/form-wizard.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'bower_components/jquery-validation/dist/jquery.validate.js',
                            'bower_components/stepy/lib/jquery.stepy.js'
                        ])
                    }]
                }
            })
            .when('/form-masks', {
                templateUrl: 'views/form-masks.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js'
                        ])
                    }]
                }
            })

        .when('/charts-canvas', {
                templateUrl: 'views/charts-canvas.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'bower_components/Chart.js/Chart.min.js'
                        ])
                    }]
                }
            })
            .when('/charts-svg', {
                templateUrl: 'views/charts-svg.html',
                resolve: {
                    lazyLoad: ['lazyLoad', function(lazyLoad) {
                        return lazyLoad.load([
                            'bower_components/raphael/raphael.js',
                            'bower_components/morris.js/morris.js'
                        ])
                    }]
                }
            })
            .when('/:templateFile', {
                templateUrl: function(param) { return 'views/' + param.templateFile + '.html' }
            })
            .otherwise({
                redirectTo: '/'
            })
    }])
    .run(function($rootScope, $location, Appuser, envService) {
        $rootScope.$on('$locationChangeStart', function(event, next) {
            if (!Appuser.isAuthenticated()) {
                if (next.toString().split('#')[1] == '/login') { // Need a way to know where this is going

                } else {
                    console.log('not authenticated', Appuser)
                    $location.path('/login')
                }
            } else {
                Appuser.getCurrent(
                    function(res) {
                        $rootScope.user = res
                        $rootScope.user.env = envService.get()
                        console.log('The current environment is ... ' + $rootScope.user.env)
                    },
                    function(err) {}
                )
            }
        })
    })