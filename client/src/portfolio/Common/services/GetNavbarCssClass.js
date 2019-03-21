angular.module('Portfolio.Common')
 .factory('GetNavbarCssClass', function($window){ // shiff screen size then gets apropriate css class

      function getNavbarCssClass(remove){

          let windowWidth = angular.element($window).outerWidth();       // get screen width
          let navbarClasses = ['horizontal-hide', 'horizontal-hide2', 'horizontal-hide3']
          let class_;

           if(windowWidth > 440)
              class_ = navbarClasses[0];                  // name of css class we want to add/remove when 
                                                        // screen > 440
           if(windowWidth >= 321 && windowWidth <= 440)
              class_ = navbarClasses[1];

           if(windowWidth < 366)
              class_ = navbarClasses[2];

           if(remove){
              navbarClasses.splice(navbarClasses.indexOf(class_),1); // remove class that we planed for a screen size
              return navbarClasses;                           // return classes that are NOT planed for a 
                                                              // screen size
           }

          return class_
      }
 
      return getNavbarCssClass;
 })
