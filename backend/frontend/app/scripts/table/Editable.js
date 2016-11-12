'use strict'

angular
  .module('theme.tables-editable', [])
  .controller('TablesEditableController', ['$scope', '$filter', '$compile', function ($scope, $filter, $compile) {
    $scope.colState = "col_num_prompt";
    $scope.numFields = 1;
    $scope.cols = [];
    $scope.page = [];
    $scope.myData = [];
    $scope.myDefs = [];
    $scope.newCol = "";

    $scope.myData = [];
    $scope.gridOptions = {
        data: 'myData',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: []
    };

    $scope.data = [
      {}
    ];

    $scope.saveData = function(data, id) {
      //$scope.user not updated yet
      angular.extend(data, {id: id});
      // return $http.post('/saveUser', data);
    };

    // remove data
    $scope.removeData = function(index) {
      $scope.data.splice(index, 1);
    };

    // add data
    $scope.addData = function() {
      $scope.inserted = {};
      $scope.data.push($scope.inserted);
    };

    // Check which key user was from pressing
    $scope.checkKey = function($event){
        if ($event.which === 13)
            $scope.addData();
    };

    // Generate table
    $scope.createTable = function() {
        $scope.colState = "display_table";

        var content = '<tr style="font-weight: bold" id="rowNames">';
        for(var i = 1; i < $scope.page.length; i++) {
            content += '<td style="">' + $scope.page[i] + '<a href="javascript:;" ng-click="removeColumn(' + i + ')"> <i class="fa fa-trash-o"></i></a> </td>';
        }
        content += '<td style="">Options </td>';
        content += '</tr>';
        content += '<tr ng-repeat="entry in data" id="rowData">';
        for(var i = 1; i < $scope.page.length; i++) {
            content += '<td ng-click="rowform.$show()"> <span editable-text="entry.' + $scope.page[i] + '" e-name="' + $scope.page[i] + '" e-form="rowform" e-required> {{ entry.' + $scope.page[i] + ' || \'empty\' }} </span> </td>';
        }
        content += '<td style="white-space: nowrap">\
            <form editable-form name="rowform" onbeforesave="saveData($data, entry.id)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == entry">\
            <button type="submit" ng-disabled="rowform.$waiting" class="btn btn-sm btn-primary"> Save </button>\
            <button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-sm btn-default"> Cancel</button>\
            </form>\
            <div class="buttons" ng-show="!rowform.$visible">\
            <button class="btn btn-sm btn-primary" ng-click="rowform.$show()">Edit</button>\
            <button class="btn btn-sm btn-danger" ng-click="removeData($index)">Delete</button>\
            </div>\
         </td>';
        content += '</tr>';

        window.document.getElementById("test").innerHTML = content;

        $compile(window.document.getElementById("test"))($scope);
    }

    // addColumn to table
    $scope.addColumn = function(colName) {
        // Check if column already exists in the array
        if ($scope.page.indexOf(colName) > -1) {
            alert("Cannot insert another column with the same name.");
            return;
        }

        $scope.page.push(colName);

        $scope.createTable();
        $compile(window.document.getElementById("test"))($scope);
    };

    // Remove a column from table
    $scope.removeColumn = function(index) {
        for(var i = 0; i < $scope.data.length; i++) {
            delete $scope.data[i][$scope.page[index]];
        }

        $scope.page.splice(index, 1);
        $scope.createTable();
        $compile(window.document.getElementById("test"))($scope);
    };

    $scope.getColumnNames = function (num) {
        for(var i = 1; i <= num; i++) {
            $scope.cols.push(i);
        }
        $scope.colState = "col_name_prompt";
    }

    $scope.backToDefault = function () {
        $scope.colState = "col_num_prompt";
        $scope.cols = [];
    }

  }]).controller('ExpandingTableController', ['$scope', '$filter', function ($scope, $filter) {
        $scope.colState = "col_num_prompt";
        $scope.numFields = 1;
        $scope.cols = [];
        $scope.page =[];
        $scope.myData = [];
        $scope.myDefs = [];
        $scope.newCol = "";

        $scope.gridOptions = {
            data: 'myData',
            enableCellSelection: true,
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellEditOnFocus: true,
            columnDefs: 'myDefs'
        };



        $scope.generateTable = function() {
            $scope.colState = "display_table";
            console.log($scope.page); // [1: "col1", 2: "col2", 3: "col3"]

            var newdefs = [];
            for(var i = 1; i < $scope.page.length; i++) {
                newdefs.push({field: $scope.page[i], displayName: $scope.page[i], enableCellEdit: true});
            }
            $scope.myDefs = newdefs;
        }

        $scope.addRow = function() {
            $scope.inserted = {};
            $scope.myData.push($scope.inserted);
        };

        $scope.checkKey = function($event){
            console.log($event.keyCode);
            if ($event.which === 13) console.log("I am here");
        };

        $scope.addColumn = function (newCol) {
            var newdefs = $scope.myDefs;
            newdefs.push({field: newCol, displayName: newCol, enableCellEdit: true});
            $scope.myDefs = newdefs;
        };

    }])
