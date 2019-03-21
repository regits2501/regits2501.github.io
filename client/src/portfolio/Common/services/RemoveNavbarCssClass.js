angular.module('Portfolio.Common')
 .factory('RemoveNavbarCssClass', function(GetNavbarCssClass, NAVBAR_POSITION, $window){ // Controls hide & show
                                                                                         // of the navbar
     function removeNavbarCssClass (){  // is set on resize event (see setnavbar directive)

        let navbar = angular.element(document.querySelector('.navbar'));
        let vertical = angular.element($window).outerWidth() >= 1024 ? true : false; // make a service
        
        if(vertical){ 
            navbar.removeClass('navbar-horizontal-hide navbar-horizontal-hide2 navbar-horizontal-hide3');
           if(!NAVBAR_POSITION.shown){
             navbar.addClass('navbar-vertical-hide'); // when switched to vertical 
           }                                                                   // from hidden horizontal, 
        }                                                                      // add vertical-hide
        else
            navbar.removeClass('navbar-vertical-hide');    // if horizontal, remove vertical class artefact

        if (angular.element($window).outerWidth() >= 1024) return; // do the rest only when screen width < 1024
        if(NAVBAR_POSITION.shown) return ; // only when navbar is hidden do the rest

        let remove = GetNavbarCssClass(true);
        let add    = GetNavbarCssClass();   
        let len = remove.length;

        navbar.addClass('navbar-' + add); // first add one that we need

        for(var i = 0; i < len; i++){
            
            navbar.removeClass('navbar-' + remove[i]);
        } 
       
     }

    return removeNavbarCssClass;
 })
