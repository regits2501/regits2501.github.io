/* angular.module('Portfolio.Common')  // OBSOLETED -for removel
 .factory('HideTopAndBottomService', function(CURRENT_SIDE){

      let ref = {          // ref will save timeout in order to be cleared/removed when fastclicking sides happen
         timeouts: []
      }
                                                           // DO THIS only when window.height > window.width !!!
      function htab(){

         let current_position  = CURRENT_SIDE.current_position;
         let previous_position = CURRENT_SIDE.previous_position;

                                              console.log('in htab');
                                              console.log('current_position:', current_position);
                                              console.log('previous_position:', previous_position);
         let shown    = current_position;
 
         let top    = angular.element(document.querySelector('.twiz-client')) // top side  
         let bottom = angular.element(document.querySelector('.quote-owlet')) // bottom side

         if( shown !== 'top' && shown !== 'bottom'){  console.log('LATERAL --')
         
           let dim = {
              display: 'block',
              opacity: '1',
              transition: 'opacity .4s cubic-bezier(1.000, 0.025, 1.000, -0.185) .6s',// slow beggining, fast end
              opacity: '0'                         
           }

           let remove =  {
              display:'none'
           }

           top.css(dim);                // dim top and bottom 
           bottom.css(dim);

           ref.timeouts.push(setTimeout(function(){// Remove them from flow in order for top and bottom sides not
                                                  // to stick out from the edges of the window/tab. Save timeout.
                   top.css(remove);
                   bottom.css(remove) 
           }, 1000))                                // 1s - since the cube rotates that much time to show a side
           
         }
         else{
            
            if (previous_position === 'top' || previous_position === 'bottom') return; 
                                      // if we were on top or bottom do nothing
            for(var i in ref.timeouts){ clearTimeout(ref.timeouts[i]) };
           
            let show = {
               display: 'block',
               opacity: '0',
               transition: 'opacity .2s cubic-bezier(0.025, 1.170, 0.000, 0.960) ', // fast beggining, slow end
               opacity: '1'
             }

            top.css(show);
            bottom.css(show); 
         }
      }

     return htab
 })
