angular.module('Portfolio.Common')
 .service('RotateCubeEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('rotateCube',side) }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('rotateCube', func)};        // set listener for event
 })
