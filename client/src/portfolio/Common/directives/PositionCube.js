angular.module('Portfolio.Common')
 .directive('positioncube', function($window, CURRENT_SIDE, PositionService){

     let linker = function(scope, elem, attrs){

                              // get reference to currently shown side 
        
         let domArgs = { 
            'side' : '',
            'elem' : elem,                                             // Cube element
            'scene': angular.element(document.querySelector('.scene')) // Element with 3d contect set
         }

         let cssArgs = {
            sign:'-',            // Sign for z-axis offset we use to position cube
            rotateCube: true,    // We are positioning cube element
            rotate: 'last'       // Add rotation information last 
         }

         function PositionCube(){
           
            domArgs.side = CURRENT_SIDE.value;   // To correctly position in reference to currently shown side
              	console.log('positionCube - CURRENT_SIDE.value.position', CURRENT_SIDE.value.position)

            PositionService(domArgs, cssArgs);
            
         }

         PositionCube();
         
         let window_ = angular.element($window);  
         
         window_.on('resize', PositionCube)                // Reposition cube on any window size change, to keep
                                                           // page look clean and not fuzzy.
        
         scope.$on('destroy', function(){ 
            window_.off('resize', PositionCube)            // When scope is gone remove listener to prevent mem.
                                                           // leaks.
         })

     }
 
    
     
     return {
        restrict: 'A',
        link: linker
     }  
 })
