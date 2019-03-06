angular.module('Portfolio.TwizClient')
 .factory('StartAnimationService', function($window){ // animates twiz client or server start , to indicate 
                                                      // to the  user where to click for full animation display
 
     function addAndRemoveCss(element, className, delay){ // add class and remove it in deley ms

          element.addClass(className)
  
          setTimeout(function(){
              element.removeClass(className)
          }, delay) 
     }

     function animateStart(elementClassName, animationClassName){  // Animate twiz client or server start 

          let start    = angular.element($window.document.querySelector(elementClassName));    
          addAndRemoveCss(start, animationClassName, 700);

             
     }

     function animateStartWithTimeout(elementClassName, animationClassName, timeout){
         setTimeout(animateStart.bind(null, elementClassName, animationClassName), timeout);
     }
 
     let twiz_server_done = false;            // flags used to run start animations only once (after initial run)
     let twiz_client_done = false;

     return function startAnimation(side_name){


          if(side_name === 'twiz-client'){
             if(twiz_client_done) return;

             animateStartWithTimeout('.twiz-start', 'twiz-start-color', 1200);
             twiz_client_done = true;
          }
          else 
            if(side_name === 'twiz-server') {
               if(twiz_server_done) return;

               animateStartWithTimeout('.twiz-server .twiz-start', 'start-grey', 1200)
               twiz_server_done = true;
          }
          
           
     }

     

 })
