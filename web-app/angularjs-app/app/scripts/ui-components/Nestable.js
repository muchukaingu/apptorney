'use strict'

angular
  .module('theme.ui-nestable', [])
  .controller('NestedTreeDemoController', ['$scope', function ($scope) {


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

    $scope.reNumber = function(item){
      item.subParts.forEach(function(part){
        console.log(part);
      })
    }

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
        var siblings = scope.$parent.siblings();




        if (scope.prev() && nodeData.subParts.length == 0){
          //console.log(scope.prev());
          var previousNode = scope.prev();
          previousNode = previousNode.$modelValue.subParts[previousNode.$modelValue.subParts.length-1].number;
          var previousNumber = parseInt(previousNode.substring(0,previousNode.length-2));
          childNode.number = (previousNumber + 1) + '. ';
        }
        else if(scope.prev() && nodeData.subParts.length > 0) {
          childNode.number = (parseInt(nodeData.subParts[nodeData.subParts.length-1].number) + 1) + '. ';
        }
        else if(!scope.prev()) {
          childNode.number = (nodeData.subParts.length + 1) + '. ';
        }


        if (!scope.$parent.$parent.$last){
          siblings.forEach(function(sibling){
            if (sibling.index() > scope.$parent.index()){

            sibling.$modelValue.subParts.forEach(function(part){
                var previousNode = siblings[sibling.index()-1]; //scope.$parent;

                previousNode = previousNode.$modelValue.subParts[previousNode.$modelValue.subParts.length-1].number;
                console.log(parseInt(previousNode.substring(0,previousNode.length-2)));
                var previousNumber = parseInt(previousNode.substring(0,previousNode.length-2));
                part.number = previousNumber + ((sibling.index()==scope.$parent.index()+1)?2:1) + sibling.$modelValue.subParts.indexOf(part) + '. ';
              })
            }

          })
          //console.log(siblings[0]);
        }


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
