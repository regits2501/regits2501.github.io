/* angular.module('Portfolio.Common')    // OBSOLITED - remove it
 .directive('leftrightsidecontroll',function($window){ //
       
   
       let linker = function (scope, elem, attrs){  // puts left and right side to be  - height X height

            let leftSide  = new RegExp("twiz-server");
            let rightSide = new RegExp("hmac-sha1");
            let document = $window.document;            // convenience variable
            let lateralSide;

         setTimeout(function(){
            if(leftSide.test(attrs.class)){
                 lateralSide = angular.element(document.querySelector('.twiz-server')); 
                console.log('LEFT')
            }
            if(rightSide.test(attrs.class)){  
                lateralSide = angular.element(document.querySelector('.hmac-sha1')); 
                console.log('RIGHT')
            }
            
            if(!lateralSide) return;
            let sceneHeight = angular.element(document.querySelector('.scene')).outerHeight()+ 'px'
             console
            lateralSide.css({
                 width: sceneHeight // makes width and height same
            })
         }, 0);  
       }

       return {

          restrict: 'A',
          link: linker
       }
 })
*/
