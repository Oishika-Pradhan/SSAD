$(function() {
  $("#catalog").accordion();
});
var App = angular.module('drag-and-drop', ['ngDragDrop']);

App.controller('oneCtrl', function($scope, $timeout) {
  var i=0;
  $scope.list1 = [{'type': 'text box','value': 'got it'},{'type': 'Radio button','value': 'got it'},{'type': 'Check boxes','value': 'got it'},{'type': 'Text area','value': 'got it'}];
  $scope.list4 = [];
 	
  $scope.dropping = function(){
    
    /*console.log('askjfkcbakjbv');
    console.log(i);
    console.log($scope.list4);
    i = i+ 1;*/
    $http.post('/deleteuser',details).then(function(response) {//when successfull
        //console.log('successfully deleted');
        window.location.href = "http://localhost:8080/my_tasks"
        /*$location.path('').replace('/my_tasks');*/
        /*render('search.html');*/
    }, function() {//error occured

    });

    
    
  }

  $scope.drop = function(){
    
    console.log('askjfkcbakjbv in drop');
    console.log(i);
    console.log($scope.list4[i]);
    i = i+ 1;
    return true;
    
  }
  $scope.hideMe = function() {
    return $scope.list4.length > 0;
  }
});
