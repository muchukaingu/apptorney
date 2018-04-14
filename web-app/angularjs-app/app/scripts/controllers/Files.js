'use strict'
angular.module('apptorney')

// The example of the full functionality
.controller('TestController', function($scope, $http, FileUploader, Legislation) {
    'use strict';

    // create a uploader with options
    $scope.containerName = "";
    $scope.currentPart = {};

    var uploader = $scope.uploader = new FileUploader({
        scope: $scope, // to automatically update the html. Default: $rootScope
        url: 'https://circuitbusiness-apptorney.eu-gb.mybluemix.net/api/files/upload',
        formData: [
            { key: 'value' }
        ]
    });

    // ADDING FILTERS
    uploader.filters.push({
        name: 'filterName',
        fn: function(item, options) { // second user filter
            return true;
        }
    });

    // REGISTER HANDLERS
    // --------------------
    uploader.onAfterAddingFile = function(item) {

        $scope.currentPart = item.part;
        $scope.containerName = item.name;
        var filename = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
        var orginalName = item.file.name;
        //$scope.createContainer($scope.containerName);
        var extn = orginalName.split(".").pop();
        item.file.name = filename + '.' + extn;
    };
    // --------------------
    uploader.onAfterAddingAll = function(items) {
        console.info('After adding all files', items);
    };
    // --------------------
    uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('When adding a file failed', item);
    };
    // --------------------
    uploader.onBeforeUploadItem = function(item) {
        console.info('Before upload', item);
    };
    // --------------------
    uploader.onProgressItem = function(item, progress) {
        console.info('Progress: ' + progress, item);
    };
    // --------------------
    uploader.onProgressAll = function(progress) {
        console.info('Total progress: ' + progress);
    };
    // --------------------
    uploader.onSuccessItem = function(item, response, status, headers) {
        var file = JSON.parse(item._xhr.response);
        console.info('After adding a file', file);
        $scope.legislationPart.file = file;
        console.info('part', $scope.legislationPart);
        //$scope.currentPart.file = location.href.split('#')[0]+'api/containers/attachments/download/'+item.file.name;
        console.info('Success', response, status, headers);
        //$scope.$broadcast('uploadCompleted', item);
    };
    // --------------------
    uploader.onErrorItem = function(item, response, status, headers) {
        console.info('Error', response, status, headers);
    };
    // --------------------
    uploader.onCancelItem = function(item, response, status, headers) {
        console.info('Cancel', response, status);
    };
    // --------------------
    uploader.onCompleteItem = function(item, response, status, headers) {
        console.info('Complete', response, status, headers);
    };
    // --------------------
    uploader.onCompleteAll = function() {
        console.info('Complete all');
    };
    // --------------------

    $scope.createContainer = function(containerName) {
        var options = {
            'name': containerName
        };
        $http.post('/api/containers/', JSON.stringify(options)).success(function(data) {
            console.log(data);
            $scope.files = data;
        });
    }
}).controller('FilesController', function($scope, $http) {

    $scope.load = function() {
        $http.get('/api/containers/attachments/files').success(function(data) {
            console.log(data);
            $scope.files = data;
        });
    };

    $scope.delete = function(id) {
        $scope.currentPart.file = undefined;
        $http.delete('/api/containers/attachments/files/' + encodeURIComponent(id)).success(function(data, status, headers) {

            $scope.files.splice(0, 1);
        });
    };

    $scope.$on('uploadCompleted', function(event) {
        console.log('uploadCompleted event received');
        $scope.load();
    });

});