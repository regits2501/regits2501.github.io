angular.module('Portfolio.Common')
 .service('EqualDimensionsEventService', function($rootScope){ // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('setEqualDimensions') }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('setEqualDimensions', func)};        // set listener for event
 })
