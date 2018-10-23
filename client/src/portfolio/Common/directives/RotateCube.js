angular.module('Portfolio.Common')
 .directive('rotatecube', function(RotateCubeEventService, CalculateOffsetService){

      let linker = function(scope, elem, attrs, ctrl){
             let cube = elem;
                                                       console.log('rotateCube directive')

             RotateCubeEventService.listen(function(){
                let side = arguments[1]; 
               
                                                          console.log('cubeRotated@@');
                                                           console.log('side:', side)

                let offset = CalculateOffsetService.calc({
                   position: side.position, // side on which position we want to show
                   width:    cube.outerWidth(),
                   height:   cube.outerHeight()
                })
                                                 console.log('translateZ(-' + offset + 'px) ' + side.rotateCube);
                cube.css({
                   transform: 'translateZ(-' + offset  + 'px) ' + side.rotateCube
                }) 
             })          
      } 


      let controller = function($scope){
         rotateCube = this;
         rotateCube.print = function(){
 
           console.log('cube rotated');
         }
      }

     return {
        restrict: 'A',
        link: linker,
        controller: controller
     }
 })
