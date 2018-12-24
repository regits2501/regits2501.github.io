angular.module('Portfolio.Common')
 .directive('setNavbar', function(SetNavbarEventService, SetNavbarService, RemoveNavbarCssClass, $window){

      let linker = function(scope, elem, attrs){
        
         SetNavbarEventService.listen(function(){
             SetNavbarService();
         })
         
         let window_ =  angular.element($window);

         window_.on('resize', RemoveNavbarCssClass)
         scope.$on('destroy', function(){
             window_.off('resize', RemoveNavbarCssClass);
         })
      }

 
      return {
         restrict: 'A',
         link: linker
      }
 })
