angular.module('Portfolio.Common')
 .factory('SelectNavbarOptionService', function(CURRENT_SIDE){
    
      return function selectNavbarOption(sides){
             
           if (CURRENT_SIDE.previous_position === CURRENT_SIDE.current_position) return;// same option is clicked 
           
           let prevSelected;
                                         console.log('IN SELECT NAVBAR Option:::')
           for(let i in sides){

                let side = sides[i];
                if(side.position === CURRENT_SIDE.previous_position){
                   
                  
                   prevSelected = angular.element(document.querySelector('.nav-' + side.name));
                       console.log('prevSelected:', prevSelected);
                   prevSelected.removeClass('selected'); // unselect previously selected navbar option
                }
           }

           let side = CURRENT_SIDE.value;
           let newSelected = angular.element(document.querySelector('.nav-' + side.name));// currentSide
                                                                                          // becomes newSelected
            console.log("NEw SElected:", side.name)
     //      newSelected.selected = true;                   // mark it as selected
           newSelected.addClass('selected');              // add animation to selected navbar option
      } 
 })
