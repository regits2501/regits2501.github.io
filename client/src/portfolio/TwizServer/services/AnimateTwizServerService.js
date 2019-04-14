angular.module('Portfolio.TwizServer')
 .factory('AnimateTwizServerService', function(AnimateTwizClientService, GetTwizServerCirclesService){


     let tws_circles = GetTwizServerCirclesService();  // get the circles from twiz-server page
     let tws_timeouts = [];
     return function animateTwizServer () {
          AnimateTwizClientService(tws_circles, tws_timeouts);      // animation logic is same as for the twiz-client page
     }

 })
