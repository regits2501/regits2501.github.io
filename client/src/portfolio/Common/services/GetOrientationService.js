angular.module('Portfolio.Common')
 .factory('GetOrientationService', function($window){

      return function getOrientation(){

         let scene = angular.element($window.document.querySelector('.scene')) // get ref. element for dimensions
         let sceneHeight = scene.outerHeight();
         let sceneWidth  = scene.outerWidth();
        
         if(sceneHeight > sceneWidth){          // we are in portrait mode
            return 'portrait';
         }
        
         if(sceneWidth > sceneHeight){         // we are in landscape mode
            return 'landscape';
         }
         else  return 'cube'                   // dimensions are equal  

         
      }

 })
