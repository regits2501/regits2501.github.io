angular.module('Portfolio.Common')
 .directive('topBottomShimControll', function($window){

     function linker(scope, elem, attrs){
      
         let topSide  = new RegExp("twiz-client");
         let bottomSide = new RegExp("quote-owlet");
         let document = $window.document;            // convenience variable
         let side_;
         var shimClass =''

         function shimTheWhiteSpace(){

            if(topSide.test(attrs.class)){
                 side_ = angular.element(document.querySelector('.twiz-client')); // set reference to top element
 
                console.log('top')
                position = 'top'
            }

            if(bottomSide.test(attrs.class)){  
                side_ = angular.element(document.querySelector('.quote-owlet')); //set reference to bottom element
                console.log('bottom');
                position = 'bottom';
            }
            
            if(!side_) return;
            
            let scene = angular.element(document.querySelector('.scene'))
            let sceneWidth = scene.outerWidth();
            let sceneHeight = scene.outerHeight();
                                                                         // ONLY WHNE WIDTH IS LARGER THEN HEIGHT
            shimOffset = '-' + ((sceneWidth - sceneHeight) / 2 ) + 'px';  
            console.log('OFFSET::: ', shimOffset) 
           // insert shim as first element in side_ element

            side_.prepend('<div class="side-shim side '+ position +'-shim"></div>');  // add shim into page

            let shim = angular.element(document.querySelector('.' + position + '-shim')); // select shim
 
            shim.css({
                 height: sceneWidth,       // makes dimensions same
                 bottom: shimOffset
            });
           
         }

         let shimTheWhiteSpace_ = shimTheWhiteSpace.bind(null);
         let window_ = angular.element($window);

         setTimeout(shimTheWhiteSpace_, 0); // invoke asap
         
         window_.on('resize', shimTheWhiteSpace_)    // Reposition cube on any window size change, to keep
                                                           // page look clean and not fuzzy.
        
         scope.$on('destroy', function(){ 
            window_.off('resize', shimTheWhiteSpace_)     // When scope is gone remove listener to prevent mem.
                                                   // leaks.
         })
 
     }

     return {
        restrict: 'A',
        link: linker
     }
 })
