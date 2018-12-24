angular.module('Portfolio.Common')
 .directive('hideTopAndBottom', function(HideTopAndBottomEventService, HideTopAndBottomService){

      let linker = function(scope, elem, attrs){

         console.log('HideTopAndBottom DIRECTIVE');
          HideTopAndBottomEventService.listen(function(){
         
               HideTopAndBottomService(); // check what needs to be redone in the main controler
          })
         
          HideTopAndBottomEventService.broadcast();  // hide top and bottom on initial directive compile
      } 

      return {
        restrict: 'A', 
        link: linker
         
      }
 })
