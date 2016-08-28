angular.module("lightmeasurer",[]).controller("myController", function ($rootScope, $scope, $http, $interval)
    {
      LoadRepos();
      LoadUser();
      var currentDate = new Date();
      $scope.daysSinceUpdate = [];
      function LoadRepos(){
          $http({
          method: 'GET',
          url: 'http://localhost:8080/repos'
          }).then (function successCallback(response) {
              $scope.repos = response;
              for (i = 0; i < $scope.repos.data.length; i++)
                {
                  var date = Date.parse($scope.repos.data[i].updated_at)
                  var dayssince = days_between(currentDate, date)
                  console.log(dayssince);
                  $scope.repos.data[i].dayssinceupdate = dayssince;
                  //$scope.daysSinceUpdate.push(dayssince);
                }
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

            }, function errorCallback(response) {
            //alert("An error occured while fetching the user data!")
            });
        };
        function days_between(date1, date2) {

          // The number of milliseconds in one day
          var ONE_DAY = 1000 * 60 * 60 * 24

          // Convert both dates to milliseconds
          var date1_ms = date1.getTime()
          //var date2_ms = date2.getTime()

          // Calculate the difference in milliseconds
          var difference_ms = Math.abs(date1_ms - date2)

          // Convert back to days and return
          return Math.round(difference_ms/ONE_DAY)

}
    });
