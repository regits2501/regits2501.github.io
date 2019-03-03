angular.module('Portfolio.TwizServer')
 .factory('GetTwizServerCirclesService', function($window){

     
    return function getTwizServerCircles(){
       let circles = []; // placeholder for green and blue elements (mosty circles on page)  
        
        // Add to purple, blue and grey circles in format [element, className]

       let pref ='.twiz-server '; // selector prefix fot the circles (elements) on twiz-server page

       circles.push([ angular.element($window.document.querySelector(pref +'.twiz-start')), 'start-grey']);
       circles.push([ angular.element($window.document.querySelector(pref +'.col-middle #out_1')), 'outer-purple']);
       circles.push([ angular.element($window.document.querySelector(pref +'.col-right #out_1')), 'outer-blue']);
     
   

       circles.push([ angular.element($window.document.querySelector(pref +'.col-middle #out_2')), 'outer-purple']);
       circles.push([ angular.element($window.document.querySelector(pref +'.col-right #out_2')),'outer-blue']);
       circles.push([ angular.element($window.document.querySelector(pref +'.col-left #out_3')), 'outer-grey']);   
       return circles;
    }

 })
