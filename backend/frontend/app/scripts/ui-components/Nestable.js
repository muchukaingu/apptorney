'use strict'

angular
  .module('theme.ui-nestable', [])
  .controller('NestedTreeDemoController', ['$scope', function ($scope) {
    $scope.list = [{
      "id": 1,
      "title": "Write documentation",
      "items": []
    }, {
      "id": 2,
      "title": "Compile Code",
      "items": [{
        "id": 21,
        "title": "Upload Files to Server",
        "items": [{
          "id": 211,
          "title": "Call client",
          "items": []
        }, {
          "id": 212,
          "title": "Buy Milk",
          "items": []
        }],
      }, {
        "id": 22,
        "title": "Set up meeting with client",
        "items": []
      }],
    }, {
      "id": 3,
      "title": "Pay office rent and bills",
      "items": []
    }, {
      "id": 4,
      "title": "Read book",
      "items": []
    }];

    $scope.selectedItem = {};

    $scope.romanize = function (num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","c","cc","ccc","cd","d","dc","dcc","dccc","cm",
                   "","x","xx","xxx","xl","l","lx","lxx","lxxx","xc",
                   "","i","ii","iii","iv","v","vi","vii","viii","ix"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("m") + roman;
    }

    $scope.options = {
    	// levelThreshold: 300000,
    };

    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope, index) {
      var nodeData = scope.$modelValue;
      var childNode = {
        id: nodeData.id * 10 + nodeData.subParts.length,
        level:(nodeData.number)?(nodeData.level+1):1,
        //number: (nodeData.subParts.length + 1) + '. ',
        title: '',
        subParts: []
      }

      if (childNode.level == 1){
        childNode.number = (nodeData.subParts.length + 1) + '. ';
      }
      else if (childNode.level == 2){
        childNode.number = '(' + (nodeData.subParts.length + 1) + ') ';
      }

      else if (childNode.level == 3){
        if (nodeData.subParts.length == 0){
          childNode.number = '(a)';
        }
        else {
          var previous = nodeData.subParts[nodeData.subParts.length-1].number;

          previous = previous.charAt(1);
          console.log(previous);
          childNode.number = '(' + String.fromCharCode(previous.charCodeAt() + 1) + ')';// Returns B;
        }

      }
      else if (childNode.level == 4){

          childNode.number = '(' + $scope.romanize(nodeData.subParts.length + 1) + ') ';


      }



      nodeData.subParts.push(childNode);
      console.log(nodeData);
    };
  }])
