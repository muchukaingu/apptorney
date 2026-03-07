'use strict'

angular
  .module('theme.tables-editable', [])
  .controller('TablesEditableController', ['$scope', '$filter', '$compile', function ($scope, $filter, $compile) {
    $scope.colState = "display_table";
    $scope.numFields = 1;
    $scope.cols = [0, 1, 2];
    $scope.page = ["column1","column2","column3"];
    $scope.myData = [];
    $scope.myDefs = [];
    $scope.newCol = "";
    $scope.table_name = "";

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
    $scope.removeData = function(index){
      console.info("removing row");
      $scope.legislationPart.table.content.splice(index, 1);
    };

    // add data
    $scope.addData = function() {
      //$scope.data = Object.keys($scope.data).map(function (key) { return $scope.data[key]; });
      console.log($scope.data);
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
        //$scope.page = Object.keys($scope.data[0]);

        //$scope.data = Object.keys($scope.data).map(function (key) { return $scope.data[key]; });
        console.log($scope.data);
        $scope.colState = "display_table";

        var content = '<tr style="font-weight: bold" id="rowNames">';
        for(var i = 0; i < $scope.page.length; i++) {
            content += '<td> <a href="javascript:;" class="circuit-editable" editable-text="page['+i+']" onbeforesave="editColumn('+i+', $data)" e-label="Column Name">{{ page['+i+'] }} </a><a href="javascript:;" ng-click="removeColumn(' + i + ')"><i class="fa fa-trash-o"></i></a></td>';
        }
        content += '<td style="">Options </td>';
        content += '</tr>';
        content += '<tr ng-repeat="entry in data" id="rowData">';
        for(var i = 0; i < $scope.page.length; i++) {
            content += '<td ng-click="rowform.$show()"> <span editable-text="entry.' + $scope.page[i].replace(" ", "_") + '" e-name="' + $scope.page[i].replace(" ", "_") + '" e-form="rowform" e-required> {{ entry.' + $scope.page[i].replace(" ", "_") + ' || \'empty\' }} </span> </td>';
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
    $scope.addColumn = function() {
        var colName;

        if($scope.page.length == 0) {
            colName = "column1";
        } else {
            colName = "column" + ($scope.page.length+1);
            if ($scope.page.indexOf(colName) > -1) {
                alert("The column name exists in this table. Please rename this column to prevent dataloss.");
            }
        }

        $scope.page.push(colName);

        $scope.createTable();
    };

    // Remove a column from table
    $scope.removeColumn = function(index) {
        // for(var i = 0; i < $scope.data.length; i++) {
        //     delete $scope.data[i][$scope.page[index]];
        // }

        console.info("removing column");

        $scope.legislationPart.table.tableHeaders.splice(index, 1);
    };

    // Edit a column from table
    $scope.editColumn = function(index, newName) {
        // Check if column already exists in the array
        if ($scope.page.indexOf(newName) > -1) {
            alert("Cannot insert another column with the same name.");
            return false;
        }

        for(var i = 0; i < $scope.data.length; i++) {
            // For each row in data, replace any spaces in the name of the column with underscore
            var colData = $scope.data[i][$scope.page[index].replace(" ", "_")];
            delete $scope.data[i][$scope.page[index].replace(" ", "_")];
            $scope.data[i][newName.replace(" ", "_")] = colData;
        }

        $scope.page[index] = newName;

        $scope.createTable();
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

    $scope.init = function () {
        $scope.createTable();
    }


    $scope.initViewable = function () {
        $scope.createViewableTable();
    }

  }])
  .controller('TablesViewableController', ['$scope', '$filter', '$compile', function ($scope, $filter, $compile) {
        $scope.page = [];


        $scope.createViewableTable = function() {
            $scope.myData = $scope.part.table.content;
            $scope.gridOptions = {
              data:'myData'
            }
        }

        $scope.initViewable = function () {
            $scope.createViewableTable();
        }


        /*$scope.$watch('page', function () {

        	$scope.createViewableTable();
        });*/



}])
