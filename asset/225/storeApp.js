var storeApp = angular
    .module('storeApp', ['ngRoute'])
    .config(['$routeProvider', '$sceDelegateProvider', '$locationProvider', 
      function ($routeProvider, $sceDelegateProvider, $locationProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://clientapi.gsn2.com/**'
      ]);
      $locationProvider.html5Mode(true);
      $routeProvider
          .otherwise({
            templateUrl: '/asset/225/content.html',
            controller: 'MyCmsCtrl',
            caseInsensitiveMatch: true
          });

    }]);

storeApp.controller('MyCmsCtrl', ['$scope', '$http', '$location', '$sce', function ($scope, $http, $location, $sce) {
  var myUrl = $location.url().replace('/', '').replace(/\s/gi, '-').replace(/\.(aspx|gsn)$/gi, '') || 'home page';
  var url =  "http://clientapi.gsn2.com/api/v1/Content/GetSingleContent/225?position=1&name=" + encodeURIComponent(myUrl);
  $scope.vm = {};
  $http.get(url).success(function (data) {
    if (data == "null"){
      data = {}
    }
    $scope.vm.Description = $sce.trustAsHtml(data.Description);
  });
}]);
