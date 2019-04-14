angular.module('Portfolio.Common')
 .directive('positionside', function(PositionService, $window){

  //    console.log('positionSide directive')

      let linker = function(scope, elem, attrs, ctrl){
              //  console.log('scope:', scope) 
           
              let domArgs = {
                 'side' : scope.side,                             // reference of the side from ng-repeat 
                 'elem' : elem,                                   // jquery wrapper on dom object
                 'scene': angular.element(document.querySelector('.scene'))
              }
              
              let cssArgs = {                                  
                 rotateSide: true,                           // We re position side
                 rotate: 'first'                            // first we are going to rotate side element
              }

              let PositionSide = PositionService.bind(null, domArgs,cssArgs) // Position side in order to form
                                                                             // box/cube
              if(attrs.class.indexOf(scope.side.name) !== -1)      
                 PositionSide();                                         // position side when directive is added 

              angular.element($window).on('resize', PositionSide);      // Do the same when window size changes
              
              scope.$on('$destroy', function(){
                 angular.element($window).off('resize', PositionSide); // When scope dies prevent leaks    
              })
       }

       return {
          restrict: 'A',
          link: linker
       }
 })
