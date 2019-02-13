angular.module('Portfolio.Common')
 .filter('shorten', function(){
    return function(input, smallScreen){
        if(smallScreen === false) return input;
        
        switch(input){
         case "twiz-server":
              return "twiz-s";
         break;
         case "twiz-client":
              return "twiz-c";
         break;
         case "hmac-sha1":
              return "hmac";
         break;
         case "quote-owlet":
              return "owlet";
         break;
         case "":
              return "L";
         break;
         case "right":
              return "R";
         break;
         default:
             return input;

        }
    }
 })
 .filter('abbreviate', function(){ // put filter first (before controller)
    return function(input){
       switch(input){
         case "front":
              return "F";
         break;
         case "back":
              return "Bc";
         break;
         case "top":
              return "T";
         break;
         case "bottom":
              return "Bt";
         break;
         case "left":
              return "L";
         break;
         case "right":
              return "R";
         break;
       }
    }
 })
 .controller('MainCtrl', function($scope, CURRENT_SIDE, NAVBAR_POSITION, RESIZE_EVENT,
                                  ShortenOnSmallScreensService, HidesAddressBarEventService,
                                  RotateCubeEventService, EqualDimensionsEventService,
                                  HideTopAndBottomEventService, SetNavbarEventService,
                                  SelectNavbarOptionService, ShowProjectService){ 
   
     let main = this;

     main.sides = [
        {
          tittle: "",
          name: 'home',                   // front side
          position: 'front',
          rotateSide: "rotateY(0deg)",
          rotateCube: "rotateY(0deg)",
          url: 'client/src/portfolio/Home/tmpl/home.html',
          selected:''
        },
        {
          name: "cv",                    // "back" or the cirriculum vitae
          tittle:"",
          position:'back',
          rotateSide: 'rotateY(180deg)',
          rotateCube: 'rotateY(-180deg)',
          url: 'client/src/portfolio/Cv/tmpl/cv.html',
          selected: ''
        },
        {
          name: "quote-owlet",          // "bottom"
          tittle: "",
          position: 'bottom',
          rotateSide: 'rotateX(-90deg)',
	  rotateCube: 'rotateX(90deg)',
          url: 'client/src/portfolio/QuoteOwlet/tmpl/quote-owlet.html',
          selected: '',
          info:{
            desc: 'Random quote machine. Integrates Twiz in order to interact with Twitter.',
            tech: 'Vanilla JS.',
            github: 'https://github.com/gits2501/QuoteOwlet'
          }
        },
        {
          name: "hmac-sha1",            // "right"
          tittle:"",
          position:'right',
          rotateSide: "rotateY(90deg)",
          rotateCube: 'rotateY(-90deg)',
          url: 'client/src/portfolio/HmacSha1/tmpl/hmac-sha1.html',
          selected: '',
          info: {
             desc: "Form of a digital signature. Can produce hash string that is used to provide data integrity and authentication.",
             tech: " Vanilla JS, NPM, Node, Crypto, Tap. ",
             github: "https://github.com/gits2501/Hmac_Sha1"
          }
        },
        {
          name: "twiz-client",          // "top"
          tittle:"",
          position: 'top',
          rotateSide: 'rotateX(90deg)',
          rotateCube:'rotateX(-90deg)',
          url: 'client/src/portfolio/TwizClient/tmpl/twiz-client.html',
          selected:'',
          info: {
            desc: 'Browser part of Twitter\'s authentication and authorization algorithm (OAuth 1.0a).',
            tech: 'Vanilla JS, Browserify, NPM, Istanbul, Mocha, Coveralls, Mocha-Headless-Chrome, Eslint.',
            github: 'https://github.com/gits2501/twiz-client'
          }
        },
        {
          name: "twiz-server",          // "left"
          tittle:"",
          position:'left',
          rotateSide: "rotateY(-90deg)",  // Initail rotation this side has when cube/box forms
          rotateCube: 'rotateY(90deg)',   // Rotation that cube element needs to have in order to show this side
          url: 'client/src/portfolio/TwizServer/tmpl/twiz-server.html',
          selected:'',
          info: {
             desc: 'Server part of Twitter\'s authentication and authorization algorithm (OAuth 1.0a).',
             tech: 'Node, Express, NPM, Nyc, Mocha, Nock, Node-Mocks-Http, Coveralls, Eslint.' ,
             github: 'https://github.com/gits2501/twiz-server'
          }
        }
     ];

    
     CURRENT_SIDE.value = main.sides[0];     // home side is initialy shown

     main.rotateCube = function(side){            // rotates cube/box do show a side of it

         RotateCubeEventService.broadcast(side);  // rotate cube/box to side we want (we clicked)
         this.setCurrentSide(side);               // set side that is currently shown
         console.log('CURRENT_SIDE', CURRENT_SIDE)
         this.setEqualDimensions();               // Set dimension to equal those of the window/tab
         this.hideTopAndBottom();                 // Hides top and bottom sides when when other sides are shown
         this.selectNavbarOption(this.sides);     // Handles css animation for selected (clicked) navbar option
     }
     setTimeout(function(){
        main.setEqualDimensions();     
     }, 0)
   
     main.setEqualDimensions = function(){ console.log('main.setEqualDimensions')

         RESIZE_EVENT.value = false;              // mark that EqualDim(..) was not called on resize event
         EqualDimensionsEventService.broadcast(); // brodcast event for setting height and width to all sides
     }
 
     main.setCurrentSide = function(side){       // mark which side is currently shown
        CURRENT_SIDE.value     = side;           // ref to the side object

        CURRENT_SIDE.previous_position = CURRENT_SIDE.current_position || '';  // remember previous position
        CURRENT_SIDE.current_position  = side.position;                        // set current position 
     }
     
                
     main.hideTopAndBottom = function(){ // 
        HideTopAndBottomEventService.broadcast();
     }

     NAVBAR_POSITION.shown = true;              // initialy is rendered as shown on page

     main.setNavbar = function(){        console.log("SET NAVABAR")
        SetNavbarEventService.broadcast();
     }

     main.selectNavbarOption = function(){ // makes css animation on selected navbar option
        SelectNavbarOptionService(this.sides);
     }

     main.hmacAndTwizServ = function(include){    //  filter two related projects
           
         return function (side){
            if(include ) return side.name === 'hmac-sha1' || side.name === "twiz-server"; // include both
            
            return side.name === 'quote-owlet' || side.name === 'twiz-client';  // anything else then those 2
         }
     }      

     main.pickedProject;         
     main.previousPickedOnLine;  // previously clicked text near horizontal line

     main.pickProject = function(side){ console.log("pickedProject: ", side)
          ShowProjectService(side, this, $scope);
        
     } 

     main.projectsOnly = function(){
 
        return function(side){
          
            if(side.name !== 'cv' && side.name !== 'home') return true;
                   
        }  
     }
     
     
     HidesAddressBarEventService();                              // (dont chop off page)  
    
 })
 .value('CURRENT_SIDE',       { value:'', toBeShown: {}}) // descibes currently shown side of the cube/box
 .value('NAVBAR_POSITION',    { shown:''})
 .value('ADDRESS_BAR_HIDDEN', { value:'', counter: 6 })
 .value('RESIZE_EVENT',       { value: ''})
