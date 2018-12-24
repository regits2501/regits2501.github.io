angular.module('Portfolio.Common')
 .factory('SetNavbarService', function(NAVBAR_POSITION, GetNavbarCssClass){
     
       // select screen-edge, nav, add classes for switching positions
       // if navabr is shown move it out of the screen, if navbar is not shown place it on screen 
 
       function setNavbarService(){ // Shows/Hides navbar. Is set to fire on click event(see SetNavbar directive)

           let navbar     = angular.element(document.querySelector('.navbar'))      // the real navbar
           let screenEdge = angular.element(document.querySelector('.screen-edge')) // abstraction of screen edge
           let nav        = angular.element(document.querySelector('.nav'))         // abstraction of navbar 
         //  let window_    = angular.element(window);

           let vertical   = navbar.outerHeight() > 100 ? true : false;     // check how navbar is positioned
           let horizontalHide = GetNavbarCssClass()    // get css class for this screen width
          
           if(NAVBAR_POSITION.shown){
               if(vertical){

                    navbar.addClass('navbar-vertical-hide');
                    screenEdge.addClass('screen-edge-vertical-hide');
                    nav.addClass('nav-vertical-hide');
               }
               else{                    // it is in horisontal position 
                   console.log("IS HORIZONTAL")
                   navbar.addClass('navbar-' + horizontalHide);
                   screenEdge.addClass('screen-edge-horizontal-hide');
                   nav.addClass('nav-horizontal-hide');
               }

              
           }
           else {                                            // Not shown on page
               if(vertical){                                 // Had vertical position
                                   
                  navbar.removeClass('navbar-vertical-hide');            // shows navbar
                  screenEdge.removeClass('screen-edge-vertical-hide');   // repositions screen edge abstraction
                  nav.removeClass('nav-vertical-hide');                  // reposition navbar abstraction 
               }
               else {                                                   
                   navbar.removeClass('navbar-' + horizontalHide);
                   screenEdge.removeClass('screen-edge-horizontal-hide') // repositions screen adge abstraction
                   nav.removeClass('nav-horizontal-hide');
               }
           }

           NAVBAR_POSITION.shown = NAVBAR_POSITION.shown ? false : true; // toggle shown flag   
       }

       return setNavbarService;
 })
