angular.module('Portfolio.Common')
 .service('SetNavbarEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('setNavbar') }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('setNavbar', func)};        // set listener for event
 })
