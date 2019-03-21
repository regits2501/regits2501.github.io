angular.module('Portfolio.Common')
 .factory('LoadingService', function($rootScope){

     return function Loading(flag){                       // Set variable on rootScope that controlls showing of
                                                          // loaded page
        $rootScope.loading = flag;     // true or false
     }
 })
