angular.module("lightmeasurer",[]).controller("myController", function ($scope, $http, $q)
    {
      LoadRepos();
      LoadUser();
      var currentDate = new Date();
      $scope.showcommits = false;
      $scope.showissues = false;
      $scope.commitcounter = 0;
      $scope.issuecounter = 0;

      $scope.daysSinceUpdate = [];
      function LoadRepos(){
          $http({
          method: 'GET',
          url: 'http://stagerepohelper.herokuapp.com/repos'
          }).then (function successCallback(response) {
              $scope.repos = response;
              for (i = 0; i < $scope.repos.data.length; i++)
                {
                  var commits = $q.defer();
                  var date = Date.parse($scope.repos.data[i].updated_at)
                  var dayssince = days_between(currentDate, date)
                  $scope.repos.data[i].dayssinceupdate = dayssince;
                  var logstring = '/blob/master/Log/LOG.md';
                  var name = $scope.repos.data[i].name.toString();
                  //console.log(name);
                  if (name.substr(0,3) == 'BAP' && name != 'BAP_Stage_Syllabus')
                    {
                      var logUrl = $scope.repos.data[i].html_url + '/blob/master/Log/LOG.md';
                      $scope.repos.data[i].logurl = logUrl;
                      //console.log($scope.repos.data[i].name);
                    }
                }
          }, function errorCallback(response) {
          //alert("An error occured while fetching the repo data!")
          });
      };

      $scope.loadCommits = function(url){
            var commitsUrl = url.commits_url.replace('{/sha}', '');
            $http({
            method: 'GET',
            url: commitsUrl
            }).then (function successCallback(response) {
                $scope.commits = response.data;
                $scope.commitamount = $scope.commits.length;
                console.log($scope.commits);
            }, function errorCallback(response) {
            //alert("An error occured while fetching the repo data!")
            });
          };

      $scope.loadIssues = function(url){
                var issuesUrl = url.issues_url.replace('{/number}', '');
                $http({
                method: 'GET',
                url: issuesUrl
                }).then (function successCallback(response) {
                    $scope.issues = response.data;
                    $scope.issueamount = $scope.issues.length;
                    console.log($scope.issues);
                }, function errorCallback(response) {
                //alert("An error occured while fetching the repo data!")
                });
          };

      function LoadUser(){
            $http({
            method: 'GET',
            url: 'http://stagerepohelper.herokuapp.com/user'
            }).then (function successCallback(response) {

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

          // Calculate the difference in milliseconds
          var difference_ms = Math.abs(date1_ms - date2)

          // Convert back to days and return
          return Math.round(difference_ms/ONE_DAY)

        }
    });
