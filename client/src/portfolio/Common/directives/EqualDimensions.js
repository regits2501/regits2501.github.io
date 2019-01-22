angular.module('Portfolio.Common')

 .directive('equalDimensions', function($window, EqualDimensionsService, EqualDimensionsEventService,
                                         RESIZE_EVENT){

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

          EqualDimensionsEventService.listen(EqualDimensions);    // Set listener for any broadcast events
          
          function EqualDimensionsOnResize(){
                                              console.log('EqualDimensions on RESIZE_EVENT')
              RESIZE_EVENT.value = true;                         // Mark that EqualDims was called on resize evt
              EqualDimensions();
          }

          angular.element($window).on('resize', EqualDimensionsOnResize); // Do the same when window size changes
              
          scope.$on('$destroy', function(){
             angular.element($window).off('resize', EqualDimensionsOnResize); // When scope dies prevent leaks    
          })
 

       }

       return {
          restrict: 'A',
          link: linker
       }
 })
