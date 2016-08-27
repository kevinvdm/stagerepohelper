angular.module("lightmeasurer",[]).controller("myController", function ($rootScope, $scope, $http, $interval)
    {
      LoadRepos();
      LoadUser();
      function LoadRepos(){
          $http({
          method: 'GET',
          url: 'http://localhost:8080/repos'
          }).then (function successCallback(response) {
              $scope.repos = response;
              
              //console.log(response);
          }, function errorCallback(response) {
          //alert("An error occured while fetching the user data!")
          });
      };
      function LoadUser(){
            $http({
            method: 'GET',
            url: 'http://localhost:8080/user'
            }).then (function successCallback(response) {
//                console.log("User loaded!");
                console.log(response);
                $scope.currentuser = response;
                $scope.currentuserid = response.data.displayName;
//                console.log($scope.currentuserid);
            }, function errorCallback(response) {
            //alert("An error occured while fetching the user data!")
            });
        };
    });
