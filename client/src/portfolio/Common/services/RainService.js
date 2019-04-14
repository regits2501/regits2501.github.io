angular.module('Portfolio.Common')
 .factory('RainService', function($window, MakeCubeTransparentService){ // makes smiley rain in canvas

     let canvas = $window.document.querySelector('.smiley-rain');
     let context2d = canvas.getContext("2d");
     let EmojiFont = new FontFace('EmojiMonochrome', 'url(client/assets/css/fonts/Emoji/EmojiSymbols-Regular.woff)');
     
     EmojiFont.load()                                  // Load font before use in canvas 
     .then(function fullfiled(font){
          $window.document.fonts.add(font);
      },
      function rejected(err){
           console.warn('Emojo MOnochrome font not loaded: \n', err);  
      })
    
     let rainInterval;                                 // Holds reverence to setInterval object for the rain

     function clearRain(){                             // Stops the rain in current canvas dimensions           
        context2d.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        clearInterval(rainInterval);                            // Stop the rain function
     }

     return function smileyRain (rain){ //console.log('SmileyRain');
         
         if(!rain){ clearRain(); return;}                // stops the rain
  
         canvas.height = canvas.clientHeight;
         canvas.width =  canvas.clientWidth;

         let canvasHeight = canvas.clientHeight;  // getBoundigClientRect() for fractional values 
         let canvasWidth = canvas.clientWidth;

         // original  ['😏', '😓', '😔' ,'😞' , '😱' ,'😠' ,'😁', '😄', '😘','😨']
         // ['😓︎','😔︎','😞︎','😱︎','😁︎','😄︎','😨︎','😏︎'];  // these work on desktop browsers
         // fallback  ['☺','☹','☯','☻']; //  doesnt work on chrome mobile browser
         // stricter fallback ['☹︎', '☺︎']; doesnt work on older chrome versions (work on newer - browsertack test)
         // ['\u263A\uFE0E','\u2639\uFE0E', '\uD83D\uDE00\uFE0E'];

         let smileys = ['😓︎','😔︎','😞︎','😬','😱︎','😁︎','😄︎','😕','😨︎','😏︎','😑']; // these work on desktop browsers
         let smileysLength = smileys.length;

         let fontSize = 32;
         let columns = canvasWidth / fontSize; 
         
         let drops = []; // number of colums for drops
         
         // x = column number, drop[x] = y coord for the smiley
         for(let x = 0; x < columns; x++)
            drops[x] = canvasHeight + fontSize / fontSize;      // All smileys have initial y coord of the screen
                                                                // to make rain fall immediately       
                                                                  
         let dropsLength = drops.length;
          
         function drawSmileyColumn(){

            context2d.fillStyle = "rgba(31, 31, 31, 0.15)";      // Make smiley leave translucent trail 
            context2d.fillRect(0, 0, canvasWidth, canvasHeight); // Add translucency accross canvas surface
            context2d.fillStyle = "#87c6ff";                     // Set smiley color
            context2d.font = fontSize + "px EmojiMonochrome";    // Set font and size

            let smiley = smileys[Math.floor(Math.random() * smileysLength)]// choose random smiley from array

            for(let i = 0; i < dropsLength; i++){                           // go through columns
                
                context2d.fillText(smiley, i*fontSize , drops[i]*fontSize);  // i*fontSize = 'x' coord (column)
                                                                             // drops[i]*fontSize = 'y' coord 
                                                                             // (vertical smiley position) 

                if(drops[i]*fontSize > canvasHeight && Math.random() > 0.975) drops[i] = 0 // Random return of 
                                                                                       // the smiley to beginning
                                                                                       // when it's off screen
                drops[i]++;  // increse 'y' coord for next hit of the column (i) - makes smiley to 'fall'
            }
         }
        
         rainInterval = setInterval(drawSmileyColumn, 38);
     
    }
 })
