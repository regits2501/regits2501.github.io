angular.module('Portfolio.Common')
 .directive('resizeRain', function($window,PILL, RainService){
 
     function linker(){

        let window_ = angular.element($window);

        window_.on('resize', function(){
           if(PILL.color === 'blue'){ 
                RainService(false);  // stop rain
                RainService(true);   // rain again
           }
        })
     }

     return {
        restrinct: 'A',
        link: linker
     }

 })
