angular.module('Portfolio.Common')
 .factory('ShimTheWhiteSpaceService',function($window, CleanLeftoverShimsService){

      let document = $window.document;            // convenience variable
      
      function shimTheWhiteSpace(verticalSides, horizontalSides, attrs){ //
            let side_;
            let scene      = angular.element(document.querySelector('.scene'))
            let sceneWidth = scene.outerWidth();
            let sceneHeight = scene.outerHeight();

            let shim = {
                 sides: '',                   // Sides of cube(box) to which we add shim elements
                 position:'',                 // Position of side we currently shim
                 offset:'',                   // How much shim needs to be moved to cover the white space
                 element:'',                  // Holds reference to element that represents shim on page
                 newCss:'',                   // How much we need to move shim in order to cover white space
                 isThere:''                   // Indicate if shim element is already inserted into page
            }

            // Decide whether you're doing horizontal (top-bottom) shim or vertical(left-right)

            if(sceneWidth > sceneHeight){                                   // White space is on horizontal sides

                shim.sides  = horizontalSides ;                                // We are shiming horizontal sides
                shim.offset = '-' + ((sceneWidth - sceneHeight) / 2 ) + 'px';  // How much px we move the shim to
                                                                               // Cover the white(empty) space

                shim.newCss = {
                   bottom: shim.offset,
                   height: sceneWidth 
                }
            }
            else 
               if(sceneHeight > sceneWidth){                               // White space is on vertical sides of                                                                           // of the cube(box)
                   shim.sides  = verticalSides;                                 
                   shim.offset = '-' + ((sceneHeight - sceneWidth) / 2 ) + 'px';

                   shim.newCss = { 
                     left:  shim.offset,
                     width: sceneHeight  
                   }
               } 
               else return;     // remove shim here also  // if equal, there is no white space so just return;

            let firstSide  = shim.sides[0];
            let secondSide = shim.sides[1];

            firstSide.reg  = new RegExp(firstSide.name);    // regexp for selecting the right sides for shiming 
            secondSide.reg = new RegExp(secondSide.name);

            if(firstSide.reg.test(attrs.class)){
                side_ = angular.element(document.querySelector('.'+ firstSide.name)); // set reference of first  
                                                                                      // side element we shim
                shim.position = firstSide.position;
            }

            if(secondSide.reg.test(attrs.class)){  
                side_ = angular.element(document.querySelector('.'+ secondSide.name)); // set reference of second
                                                                                       // element
                shim.position = secondSide.position;
            }
            
            if(!side_) return;
            
            shim.isThere = angular.element(document.querySelector('.'+ shim.position +"-shim")).context;

            if(!shim.isThere)                                                             // Shim is not inserted
               side_.prepend('<div class="side-shim side '+ shim.position +'-shim"></div>');// Add shim into page

            shim.element = angular.element(document.querySelector('.' + shim.position + '-shim')); // Select shim

            shim.element.css(shim.newCss); // set shim to cover the white space of the cube(box)
   
         }

        
       
         angular.element($window).on('orientationchange', function(){
            CleanLeftoverShimsService();  // remove any shim that were added previous to orientationChange event
            
            // Call here the ShimTheWhiteSpace_ since sfary mobile doesnt call resize event after
            // orientation-change event. Doesn't add shims as it apears now. Remove CleanLeftOverShims from
            // HidesAddresBarEventService
         })
       
         
         return shimTheWhiteSpace;
  })
