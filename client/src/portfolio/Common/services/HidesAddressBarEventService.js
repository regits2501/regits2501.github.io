angular.module('Portfolio.Common')
 .factory('HidesAddressBarEventService', function($window, ADDRESS_BAR_HIDDEN,CleanLeftoverShimsService){ // Checks if browser 
                                                          // (usualy on mobile) hides address 
                                                          // bar in order not to trigger EqualDimension service
                                                          // so we don't have page size chop off in the  middle
                                                          // of scroll.
   


   function hidesAddressBarFix(){   // Puts flags that make EqualDimension(..) NOT execute when browser
                                    // hides address(url) bar

      let window_ = angular.element($window);
      
      window_.on('touchmove', function(){ // Mark potential address bar hide on resize event, after touchmove evt
                                          console.log('::touchMove event')
          ADDRESS_BAR_HIDDEN.value = true;
          ADDRESS_BAR_HIDDEN.counter = 6;   // set counter number, since afther touchmove we have resize event
      }); 

      window_.on('orientationchange', function(){ console.log(' ~~ orientation-CHANGE ~~');
          
          ADDRESS_BAR_HIDDEN.value = true;             // If there was flag set before this event, clean it
          ADDRESS_BAR_HIDDEN.counter = 6;

        // CleanLeftoverShimsService();
      });

    } 
    
    return hidesAddressBarFix;
 })
