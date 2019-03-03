angular.module('Portfolio.TwizClient')
 .controller('TwizClientController', function(AnimateTwizClientService){


     let twcCtrl = this;

     twcCtrl.animateTwizClient = function(){  // Animate circles (tokens) on page that represent 
                                              // twiz-client process
          AnimateTwizClientService(); 
     };

 })
