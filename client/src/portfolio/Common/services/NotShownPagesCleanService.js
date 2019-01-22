angular.module('Portfolio.Common')
 .factory('NotShownPagesCleanService', function(){
   
     function notShownPagesClean(CURRENT_SIDE, pageName){
         
        for(let name in CURRENT_SIDE.toBeShown){ 
              
             if(name !== pageName){ clearTimeout(CURRENT_SIDE.toBeShown[name])}

        };

     }
    
     return notShownPagesClean
 })
