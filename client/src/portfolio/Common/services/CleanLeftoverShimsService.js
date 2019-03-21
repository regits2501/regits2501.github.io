angular.module('Portfolio.Common')
 .factory('CleanLeftoverShimsService', function($window, ORIENTATION_ON_LOAD, GetOrientationService){ 
                         // Removes shim elements that were added in previous
                                                           // ShimTheWhiteSpaceService(..) call 

     let document  = $window.document;
     let browserIsSniffed = false;

     let safariBrowser = false; // Certain safari versions first emit 'resize' event then 'orientationchange' event
     let otherBrowser = false;  // Most of other browser first emit orientationchange (Chrome, FF..) then 'resize' event
     

     function removeShims(orientationShims){

          for(let side in orientationShims){ // we remove shims (if any were added in previous orientationChange)
              orientationShims[side] = angular.element(document.querySelector('.'+ side + '-shim')); // get shim
                console.log('REMOVE orientation-shim: ', orientationShims[side]);
              orientationShims[side].remove(); // remove shim element from page
          }

     }

     function CleanLeftoverShims(){


       let landscapeShims = {'top':'', 'bottom': ''};  // prop names refer to sides on the cube/box
       let portraitShims  = {'left':'', 'right': ''};
       
      
       let currentOrientation = GetOrientationService(); // get orientaiton mode we are currently in
       
       if(!browserIsSniffed){
           console.log('ORIENTATION_ON_LOAD: ', ORIENTATION_ON_LOAD.value)
          if(ORIENTATION_ON_LOAD.value === currentOrientation) // Sniff for other browsers
             otherBrowser = true;                        // we are in some other browser (Chrome, FF...)

          if(ORIENTATION_ON_LOAD.value !== currentOrientation) // Sniff for certain safari versions
             safariBrowser = true                        // we are in safari browser

          browserIsSniffed = true;
       }
         
       if(otherBrowser){                             // Chrome, FFox 
                                               console.log('CHROME')
          if(currentOrientation === 'portrait')      // We are actually in landscape mode, since orient.change
              removeShims(portraitShims)            // happens before any 'resize' event.
                                                     // Remove any shims that were added in portrait mode
          if(currentOrientation === 'landscape')
              removeShims(landscapeShims)           // We are in actualy in portrait mode. Remove landscapeShims
          else return 
       }

       if(safariBrowser){                           // Certain Safari versions (new ones)
                                                 console.log('SAFARI: ')
          if(currentOrientation === "portrait")
             removeShims(landscapeShims)
          
          if(currentOrientation === "landscape")
             removeShims(portraitShims);
          else return
       }
       
     }
   
     return CleanLeftoverShims;

 })
