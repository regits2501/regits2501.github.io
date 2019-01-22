angular.module('Portfolio.Home')
 .factory('ShortenOnSmallScreensService', function($window){ // DELETE THIS SERVICE

      function shortenOnSmallScreens(){  // detect sceens smaller then 400px 
         return angular.element($window).outerWidth() <= 400 ? true : false;    
      }

      return shortenOnSmallScreens;
 })
