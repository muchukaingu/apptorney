'use strict'

angular
  .module('theme.navigation-controller', [])
  .controller('NavigationController', ['LegislationType', '$scope', '$location', '$timeout', '$global', '$rootScope', 'Appuser', function (LegislationType, $scope, $location, $timeout, $global, $rootScope, Appuser) {
    var legislationTypes = [];
    var yearMenu = [];


    for (var year = 1900; year<2018; year++){

        var periodMenuItem = {};
        if(year%10==0){
          periodMenuItem.children = [];
          periodMenuItem.label = String(year)+"s";
          //periodMenuItem.html= "<span class='badge badge-indigo'>4</span>";
          for (var years = year; years < year+10; years++){
            var yearMenuItem = {};
            yearMenuItem.label=String(years);
            yearMenuItem.url = "#/cases/"+String(years);
            periodMenuItem.children.push(yearMenuItem);
          }
          yearMenu.push(periodMenuItem);

        }

    }

    console.info("Year Menu", yearMenu);
    LegislationType.find(
      function(types) {
        types.forEach(function(type){
          legislationTypes.push({
            label: type.name,
            iconClasses: "fa fa-file",
            url:"#/legislations/"+type.id
          })
        })
      },
      function(errorResponse) { }
    );

    $scope.menu = [
        {
            label: 'Dashboard',
            iconClasses: 'fa fa-home',
            url: '#/dashboard'
        },
        {
            label:"Cases",
            iconClasses:"fa fa-gavel",
            url: '#/cases',
            children: yearMenu
        },
        {
            label:"Legislations",
            iconClasses:"fa fa-file-text",
            children: legislationTypes
        },

        {
            label:"Work References",
            iconClasses:"fa fa-book",
            url: '#/works'
        },

        {
            label:"Admin",
            iconClasses:"fa fa-cog",
            children: [
              {
                label:"Areas of Law",
                iconClasses:"fa fa-square",
                url: '#/areas-of-law'
              },
              {
                label:"Courts",
                iconClasses:"fa fa-institution",
                url: '#/courts'
              },
              {
                label:"Jurisdictions",
                iconClasses:"fa fa-file",
                url: '#/jurisdictions'
              },
              {
                label:"Locations",
                iconClasses:"fa fa-map-marker",
                url: '#/locations'
              },
              {
                label:"Legislation Types",
                iconClasses:"fa fa-bars",
                url: '#/legislationtypes'
              },
              {
                label:"Legislation Part Types",
                iconClasses:"fa fa-th",
                url: '#/legislationparttypes'
              },
              {
                label:"Plaintiff Synonyms",
                iconClasses:"fa fa-book",
                url: '#/plaintiffsynonyms'
              },
              {
                label:"Defendant Synonyms",
                iconClasses:"fa fa-book",
                url: '#/defendantsynonyms'
              }
            ]
        }
    ];

    var setParent = function (children, parent) {
        angular.forEach(children, function (child) {
            child.parent = parent;
            if (child.children !== undefined) {
                setParent (child.children, child);
            }
        });
    };

    $scope.findItemByUrl = function (children, url) {
      for (var i = 0, length = children.length; i<length; i++) {
        if (children[i].url && children[i].url.replace('#', '') == url) return children[i];
        if (children[i].children !== undefined) {
          var item = $scope.findItemByUrl (children[i].children, url);
          if (item) return item;
        }
      }
    };

    setParent ($scope.menu, null);

    $scope.openItems = [];
    $scope.selectedItems = [];
    $scope.selectedFromNavMenu = false;

    $scope.select = function (item) {
        // close open nodes
        if (item.open) {
            item.open = false;
            return;
        }
        for (var i = $scope.openItems.length - 1; i >= 0; i--) {
            $scope.openItems[i].open = false;
        };
        $scope.openItems = [];
        var parentRef = item;
        while (parentRef !== null) {
            parentRef.open = true;
            $scope.openItems.push(parentRef);
            parentRef = parentRef.parent;
        }

        // handle leaf nodes
        if (!item.children || (item.children && item.children.length<1)) {
            $scope.selectedFromNavMenu = true;
            for (var j = $scope.selectedItems.length - 1; j >= 0; j--) {
                $scope.selectedItems[j].selected = false;
            };
            $scope.selectedItems = [];
            var parentRef = item;
            while (parentRef !== null) {
                parentRef.selected = true;
                $scope.selectedItems.push(parentRef);
                parentRef = parentRef.parent;
            }
        };
    };

    $scope.$watch(function () {
      return $location.path();
    }, function (newVal, oldVal) {
      if ($scope.selectedFromNavMenu == false) {
        var item = $scope.findItemByUrl ($scope.menu, newVal);
        if (item)
          $timeout (function () { $scope.select (item); });
      }
      $scope.selectedFromNavMenu = false;
    });

    Appuser.getCurrent(function(res){
      $rootScope.user = res;


      if($rootScope.user){
        console.info('User in Scope', $rootScope.user);
        var menu = $scope.menu;



         if($rootScope.user.userType == 4){
           angular.forEach(menu, function (child) {
               if(child.label !== "Cases"){
                 console.log(child.label);
                 menu.splice(menu.indexOf(child),1);
               }

            });


          }
          //console.info('menu', menu);

      }


    }, function(err){})












    // searchbar
    $scope.showSearchBar = function ($e) {
        $e.stopPropagation();
        $global.set('showSearchCollapsed', true);
    }
    $scope.$on('globalStyles:changed:showSearchCollapsed', function (event, newVal) {
      $scope.style_showSearchCollapsed = newVal;
    });
    $scope.goToSearch = function () {
        $location.path('/extras-search')
    };
  }])
