angular.module('Portfolio.Common')
 .directive('rotatecube', function(RotateCubeEventService, PositionService){

      let linker = function(scope, elem, attrs){
             let cube = elem;
                                         //              console.log('rotateCube directive')
            
             let domArgs = {
                  'side' : '',
                  'elem' : elem,                                             // cube element
                  'scene': angular.element(document.querySelector('.scene')) // element with 3d context set
             };
  
             let cssArgs = {
                 sign: '-',                               // Sign of traslateZ css parametar
                 rotateCube: true,                       // Rotating cube element
                 rotate: 'last'                          // Add rotation css string last 
             };


             function RotateCube(){
                                                      //    console.log('cubeRotated@@');
                domArgs.side = arguments[1];       // side is passed as second argument to listener
                PositionService(domArgs, cssArgs)  // Rotate the cube 
             }
             
             RotateCubeEventService.listen(RotateCube);

      } 
     
      return {
        restrict: 'A',
        link: linker,
      }
 })
