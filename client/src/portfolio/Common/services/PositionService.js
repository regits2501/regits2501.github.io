angular.module('Portfolio.Common')
 .factory('PositionService', function(CalculateOffsetService){


      function Position(domParams, cssParams){  // Position element on z-axis  and optionaly rotate it

         let elem  = domParams.elem;
         let scene = domParams.scene;
         let side  = domParams.side;

         let sign      = cssParams.sign || "";         // Offset sign for translateZ
         let rotate    = cssParams.rotate ;            // Priority (order) of rotation string in css string 
         let rotateY   = cssParams.rotateCube ? side.rotateCube: side.rotateSide;  // Passs rotation string for
                                                                                    // element we want ot rotate
         
         
          
         let offset = CalculateOffsetService.calc({         // Calculate z-axis offset (how much we move element)
              position: side.position,                      // Position of side we want to show
              width:    scene.outerWidth(),                 // 'scene' is reference element where 3D space is set
              height:   scene.outerHeight()
         })

         let transformStr = ''                            // string for css transform property
	 
         let translateZ = ' translateZ('+ sign + offset +'px) ';  // set the sign of the offset

         if(rotate === 'first') transformStr = rotateY + translateZ; // First rotate the element then offset it
         if(rotate === 'last')  transformStr = translateZ + rotateY; // Add rotation last

         if(!rotate) transformStr =  translateZ;                     // Just offset element without rotation
          

                                          //       console.log("PositionService: ",transformStr);
         elem.css({
             transform: transformStr,                                    // set elements css
             '-webkit-transform': transformStr,
             '-ms-transform': transformStr,
             '-o-transform': transformStr
         }) 
      }

      return Position;

 })
