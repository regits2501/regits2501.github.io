angular.module('Portfolio.TwizClient')
 .factory('AnimateTwizClientService', function($window, GetCirclesService, CURRENT_SIDE){

   

     let timeouts = [];
     let circles;

     function cancelTimeouts(timeouts){

        let len = timeouts.length;
        for(let i = 0; i < len; i++){
              $window.clearTimeout(timeouts[i]);
        }
     }

     let twc_circles = GetCirclesService();    // Get elements that repesent circles and class names to be added 
     let twc_timeouts = []; 

     return function animateTwizClient(tws_circles, tws_timeouts){

         let side = CURRENT_SIDE.value.name;
                                                
         if(side === 'twiz-server'){ 
            timeouts = tws_timeouts; 
            if(timeouts.length) cancelTimeouts(tws_timeouts); // Cancel any previous twiz-server animation
            circles = tws_circles;                                // Use twiz-server circles
         }
         
         if(side === 'twiz-client'){
            timeouts = twc_timeouts;
            if(timeouts.length) cancelTimeouts(timeouts); // Cancel any previous twiz-client animation
            circles = twc_circles;                        // Use twiz-client circles for animation
         }

         let timeStart = 0;
         
         function addClassTimeout(element, className, addTime, removeTime){

            var removeTimeNegative;

            if(removeTime + removeTime < 0){              // check if removeTime is negative
                removeTimeNegative = true;
                timeStart += removeTime;                  // timeStart is returned at same numbers like last one
            }

            let timeout_ =  setTimeout(function(){                        // add class
               element.addClass(className);

            }, addTime ? timeStart += addTime : timeStart )

            timeouts.push(timeout_);                                // we push only timeouts that add classes

            if(removeTimeNegative) removeTime = (-1) * removeTime; // Make it positive to set same offset for
                                                                   // class removal like in other calls

            setTimeout(function(){                       // remove class
               element.removeClass(className);
            }, timeStart += removeTime) 
         } 


         let len = circles.length; //  longest array length     
      
         for (let i = 0; i < len; i++){  
            let circle = circles[i]; 

            if(circle.first){
               addClassTimeout(circle.first[0], circle.first[1], 400, 700)       
               addClassTimeout(circle.second[0], circle.second[1], 0, -700); // we add 0 for same time as prevoius call
            }
            else addClassTimeout(circle[0], circle[1], 400, 700);
            
         }

        
     }

 })
