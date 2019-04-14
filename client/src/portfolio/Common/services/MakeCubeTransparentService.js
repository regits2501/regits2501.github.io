angular.module('Portfolio.Common')
 .service('MakeCubeTransparentService', function($window){


      this.transparency =  function(action){                      // make cube transparent or opaque

         let sides = $window.document.querySelectorAll('.side')  // select cube sides

         if(!sides.forEach) {
             sides.forEach = function(func){

               for(var i in sides){
                  func(sides[i])
               }
             }
         }
         
         function sideCss(cubeSide, actionName, className){ // adds or removes css to cube sides

            if(typeof cubeSide !== 'object') return;       // older browser polyfil

            let side = angular.element(cubeSide);
           
            if(side.context)                  // only DOM elements
               side[actionName](className);   // actionName = 'addClass' or 'removeClass'
         }

         sides.forEach(function(side){
             sideCss(side, action.name, action.firstCss)     // action.name = 'addClass' OR 'removeClass'
         })   
         
         setTimeout(function(action, timing){
            sides.forEach(function(side){

                  sideCss(side, action.name, action.secondCss)  // remove or bring back 'side' elements 
            })
         }.bind(null, action), action.timing)
      }
     

 })
