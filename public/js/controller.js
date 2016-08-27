angular.module("lightmeasurer",[]).controller("myController", function ($rootScope, $scope, $http, $interval)
    {
      LoadUser();
      function LoadUser(){
          $http({
          method: 'GET',
          url: 'http://localhost:8080/api/repos'
          }).then (function successCallback(response) {
              $scope.repos = response;
              console.log(response);
          }, function errorCallback(response) {
          //alert("An error occured while fetching the user data!")
          });
      };
    });
