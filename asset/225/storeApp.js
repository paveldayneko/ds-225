var storeApp = angular
    .module('storeApp', ['infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'angulartics'])
    .config(['$routeProvider', function ($routeProvider) {


      //#region route config
      var homeFile = gsn.getContentServiceUrl('/meta/' + gsn.config.ChainId + '/?name=home page&meta=home&type=text/html');
      gsn.config.DefaultLayout = gsn.getContentServiceUrl('/meta/' + gsn.config.ChainId + '/?name=home page&meta=template&type=text/html');

      $routeProvider
          .when('/', {
            templateUrl: homeFile,
            caseInsensitiveMatch: true
          })
          .otherwise({
            templateUrl: gsn.getContentUrl('/views/engine/static-content.html'),
            caseInsensitiveMatch: true
          });
      //#endregion

    }]);

