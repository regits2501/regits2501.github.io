angular.module('Portfolio.Common')

 .directive('equalDimensions', function($window, EqualDimensionsService, EqualDimensionsEventService){

       let linker = function(scope, elem, attrs, ctrl){
          console.log('equalDimensions DIRECTIVE')
          let scene = angular.element(document.querySelector('.scene'));
           // console.log('sceneHeight', scene.outerHeight());

          function EqualDimensions(){  // on broadcasted event set page dimensions 

             EqualDimensionsService({
                 page:   elem,
                 attrs:  attrs,
                 scene: scene
             })
          }

          EqualDimensionsEventService.listen(EqualDimensions)
          
          angular.element($window).on('resize', EqualDimensions);      // Do the same when window size changes
              
          scope.$on('$destroy', function(){
             angular.element($window).off('resize', EqualDimensions); // When scope dies prevent leaks    
          })
 

       }

       return {
          restrict: 'A',
          link: linker
       }
 })
