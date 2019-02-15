angular.module('Portfolio.TwizClient')
 .factory('AnimateTwizClientService', function($window, GetCirclesService){

   

     let timeouts = [];

     function cancelTimeouts(){
                                      console.log('in CANCEL TIMEOUTS');
        let len = timeouts.length;
                                        console.log('length:', len)
        for(let i = 0; i < len; i++){
              $window.clearTimeout(timeouts[i]);
        }
     }

     let circles = GetCirclesService();        // Get elements that repesent circles and class names to be added 

     return function animateTwizClient(){

         if(timeouts.length) cancelTimeouts();

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
                                                                   // class removal like all in other calls

            setTimeout(function(){                       // remove class
               element.removeClass(className);
            }, timeStart += removeTime) 
         } 


         let len = circles.length; //  longest array length           
         for (let i = 0; i < len; i++){  
            let circle = circles[i]; 
                                         console.log('circle:', circle)
            if(circle.first){
               addClassTimeout(circle.first[0], circle.first[1], 400, 700)       
               addClassTimeout(circle.second[0], circle.second[1], 0, -700); // we add 0 for same time as prevoius call
            }
            else addClassTimeout(circle[0], circle[1], 400, 700);
            
         }

        
     }

 })
