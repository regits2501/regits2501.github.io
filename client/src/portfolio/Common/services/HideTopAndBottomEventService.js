angular.module('Portfolio.Common')
 .service('HideTopAndBottomEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(){console.log('hidetopandbottom BROADCAST'); $rootScope.$broadcast('hideTopEndBottom') };   // broadcast event
      this.listen    = function(func){ console.log('hidetopandbottom LISTENER');$rootScope.$on('hideTopEndBottom', func)}; // set listener for event
 })
