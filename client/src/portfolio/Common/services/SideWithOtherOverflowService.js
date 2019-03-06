angular.module('Portfolio.Common')
 .factory('SideWithOtherOverflowService', function(){

     return function sideWithOtherOverflow(pageName){      // Sides that need overflow value other then 'visible'
                                                    // in order for vertical scroll to work (chrome mobile issue)
                return   (pageName !== 'quote-owlet' 
                       && pageName !== 'twiz-client'
                       && pageName !== 'hmac-sha1'
                       && pageName !== 'twiz-server'); 
           
     }
 })
