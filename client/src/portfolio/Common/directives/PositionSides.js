angular.module('Portfolio.Common')
 .directive('positionside', function(CalculateOffsetService){

      console.log('positionSide directive')

      let linker = function(scope, elem, attrs, ctrl){
          //  console.log('scope:', scope) 
           
           
              let side = scope.side;                             // reference of the side from ng-repeat 
              let parent = elem.parent()[0];
           
              let scene = angular.element(document.querySelector('.scene'));
                       
              let sceneWidth  = scene.outerWidth()     //elem.parent()[0].clientWidth;   // get hight of the cube
              let sceneHeight = scene.outerHeight();   //elem.parent()[0].clientHeight;  // get width of the cube
              if(attrs.class.indexOf(side.name) !== -1){        // when side name is in class string
                  let offset = CalculateOffsetService.calc({           // calcualte offset for moving side 
                       position: side.position,
                       width:    sceneWidth,
                       height:   sceneHeight
                  }); 
                 
                  elem.css({                     // height and width are taken from scene in order for all sides
                                                 // to have perfect fit on window dimensions
                     transform: side.rotate + ' translateZ('+ offset +'px)'
                  })                                            // 'translateZ('+offset+'px)')
              }
      }

          
      

      return {
         restrict: 'A',
         link: linker,
      }
 })
