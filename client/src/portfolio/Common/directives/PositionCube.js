angular.module('Portfolio.Common')
 .directive('positioncube', function(){

     let linker = function(scope, elem, attrs){
        let cube = elem; 
         console.log('positionCube directive')        
        let width = cube.outerWidth(); 

        elem.css({
           transform: 'translateZ(-' + Math.floor(width/2) + 'px)'
        })
     }

     return {
        restrict: 'A',
        link: linker
     }  
 })
