angular.module('Portfolio.Common')
  .service('CalculateOffsetService', function(){   // service calculates how much each side of the cube (box)
                                               // needs to move in z axis direction (in order to form cube)

      let calculateOffset = this;

       calculateOffset.calc = function(args){
                                                        // horisontal(x-axis) and (z-axis) sides we move
              let position = args.position;             // in relation to parent's width. Those are: 
              let Width    = args.width;                // left, right and front, back)
              let Height   = args.height; 
            
              if(position !== 'top' && position !== 'bottom'){
                 return Math.floor(Width/2);      
                                                               
              }
              else                   
                return Math.floor(Height/2)              // vertical (top, bottom) move in relation 
                                                         // to parent's height
           

       }
 })
