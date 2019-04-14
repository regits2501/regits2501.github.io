angular.module('Portfolio.Common')
 .factory('TakeThePillService', function($window, RainService, RainTextService, MakeCubeTransparentService,
                                         PillColorService, PILL){

     
      return function takeThePill(color){
           let timing = 2000;                         // css effects timing
           let props;

           if(color === 'red'){

             props = { 
                color: {                              // Add blue color, remove red
                   add: 'blue', 
                   remove : 'red'
                },            
                action: {                             // Make cube transparent
                   name: 'addClass',                  // jquery 
                   firstCss:'transparent-side',       // Make sides transparent
                   secondCss: 'no-display',           // Remove sides from page flow
                   timing: timing                     // Remove sides timing
                }, 
                rain: true,                           // Start smiley rain
                matrixLine: 'You stay in Wonderland and I show you how deep the rabbit hole goes.'
             }
           }
           else{                    // Color is blue

             props = {
                color: {                              // Add red color, remove blue 
                   add: 'red',
                   remove: 'blue'
                },           
                action: {                             // Make cube opaque again (not transparent)
                   name: 'removeClass',               // jquery 
                   firstCss: 'no-display',            // Add sides to page flow
                   secondCss: 'transparent-side',     // Make side opaque
                   timing: 0                          // When to make sides visible
                },        
               rain: false,                           // Stop smiley rain
               matrixLine: 'The story ends. You wake up in your bed and believe what ever you want to.'
             }
           }

           RainTextService(timing);  // test chrome issue
           PillColorService.setColor(props.color.add, props.color.remove);    // Set color of the pill
           MakeCubeTransparentService.transparency(props.action);             // MakeCubeTransparent or opaque
           setTimeout(function(){ RainService(props.rain)}, timing);          // Start or stop rain (of smileys)

           PILL.color = props.color.add;                     // Set pill color flag

           console.log(props.matrixLine);                    // log matrix line on console
           
           
      }
 })
