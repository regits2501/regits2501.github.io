angular.module('Portfolio.TwizClient')
 .controller('TwizClientController', function($scope, AnimateTwizClientService, StartAnimationService,
                                                CURRENT_SIDE){


     let twcCtrl = this;

     twcCtrl.animateTwizClient = function(){  // Animate circles (tokens) on page that represent 
                                              // twiz-client process
          AnimateTwizClientService(); 
     };
     
     $scope.current_side = CURRENT_SIDE;

     $scope.$watch('current_side.value' , function(newSide, oldSide){ 
               StartAnimationService(newSide.name);
     });
 })
