angular.module('Portfolio.Common')
 .factory('SetSideOverflowService', function(SideWithOtherOverflowService){

    return function(pageName){
           let overflowSide = SideWithOtherOverflowService(pageName); // check if side needs overflow to be auto
                                                                      //  (other then visible)

           if(overflowSide){ 
               respectOverflow = 'visible';
               return respectOverflow;
           }          
           else {
               respectOverflow = 'auto';     // for sides that have vertical scroll issue (on chrome mobile)
               return respectOverflow;
           }

    }
})
