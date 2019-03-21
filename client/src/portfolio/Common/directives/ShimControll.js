angular.module('Portfolio.Common')
 .directive('shimControll', function($window, ShimTheWhiteSpaceService){

     function linker(scope, elem, attrs){
      
          
         let horizontalSides = [
            { name: 'twiz-client', position: 'top'},
            { name: 'quote-owlet', position: 'bottom'}
         ]                                                 // Top and Bottom sides

         let verticalSides = [                             // Left and Right sides
            { name: 'twiz-server', position: 'left'},
            { name: 'hmac-sha1', position: 'right'}
         ]

        
         setTimeout(function(){ ShimTheWhiteSpaceService(verticalSides, horizontalSides, attrs) }, 0)// Call asap

         let shimTheWhiteSpace_ = ShimTheWhiteSpaceService.bind(null, verticalSides, horizontalSides, attrs);
         let window_ = angular.element($window);
         
         window_.on('resize', shimTheWhiteSpace_)          // Deal with white space on every resize event also

         scope.$on('destroy', function(){ 
            window_.off('resize', shimTheWhiteSpace_)     // When scope is gone remove listener to prevent mem.
                                                          // leaks.
         })
   
     }

     return {
        restrict: 'A',
        link: linker
     }
 })
