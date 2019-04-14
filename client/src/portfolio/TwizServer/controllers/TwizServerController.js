angular.module('Portfolio.TwizServer')
 .controller('TwizServerController', function(AnimateTwizServerService){
     
     let twsCtrl = this;

     twsCtrl.animateTwizServer = function(){
          AnimateTwizServerService();
     }
 })
