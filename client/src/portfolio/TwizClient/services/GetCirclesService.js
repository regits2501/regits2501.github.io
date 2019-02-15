angular.module('Portfolio.TwizClient')
 .factory('GetCirclesService', function($window){ // Gets elements that represent circles on page, also set class
                                              // names to be added to those elements

     return function getCircles(){

      
        let circles = []; // placeholder for green and blue elements (mosty circles on page)  
        
        // Add to blue and green in format [element, className]

        circles.push([ angular.element($window.document.querySelector('.twiz-start')), 'twiz-start-color']);
        circles.push([ angular.element($window.document.querySelector('.col-right #out_1')), 'outer-blue']);
        circles.push([ angular.element($window.document.querySelector('.col-left #out_2')), 'outer-green']);

        // to outer 2 and 21  we add classes at same time also
       let bothBlue = {
            first: [ angular.element($window.document.querySelector('.col-right #out_2')), 'outer-blue'],
            second: [ angular.element($window.document.querySelector('.col-right #out_21')), 'outer-blue']
        }
     
        circles.push(bothBlue); 
     
        // to outer 3 and 31 we add clasess at same time (check loop below)
        let bothGreen = {
          first: [ angular.element($window.document.querySelector('.col-left #out_3')), 'outer-green'],
          second: [ angular.element($window.document.querySelector('.col-left #out_31')), 'outer-green']
        }
   
        circles.push(bothGreen)

        circles.push([ angular.element($window.document.querySelector('.col-right #out_3')), 'outer-blue']);
        circles.push([ angular.element($window.document.querySelector('.col-middle #out_4')),'col-middle outer-gray']);
        circles.push([ angular.element($window.document.querySelector('.col-right #out_4')), 'outer-blue']);   
        
        return circles;
     }

 })
