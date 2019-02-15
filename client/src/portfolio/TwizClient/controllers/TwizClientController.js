angular.module('Portfolio.TwizClient')
 .controller('TwizClientController', function(AnimateTwizClientService){


     let twcCtrl = this;

     twcCtrl.animateTwizClient = function(){
          AnimateTwizClientService(); 
     };

 })
