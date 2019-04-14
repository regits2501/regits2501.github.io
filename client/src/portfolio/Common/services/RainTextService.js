angular.module('Portfolio.Common')
 .factory('RainTextService', function($window){
  
       let firstLineElement  = angular.element($window.document.querySelector('.first-line'));
       let secondLineElement = angular.element($window.document.querySelector('.second-line'));  
       let firstLine  = "Javascript doesn't have classes";
       let secondLine = "(even with ES6)";

       return function rainText(timeout){

           if(!firstLineElement.text()){ 
                firstLineElement.text(firstLine)      // add text
                secondLineElement.text(secondLine)    
           }
           else {
             setTimeout(function(){
                 firstLineElement.text('');               // remove text
                 secondLineElement.text('');               // remove text
             }, timeout);
           }
                                                          

            
           
       }       
 })
