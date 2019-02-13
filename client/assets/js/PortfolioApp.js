angular.module('Portfolio.Home', []);

angular.module('Portfolio.Home')
 .factory('ShowProjectService', function(){
        
     function showProject(side, main, mainScope){
                          // side , sides      , pickedProject

         // pick sphere and projectview to animate
         // t1 - when project is chosen (hide corona from sphere)
         //      add chosen project corona
         // t1 -same time dim the project view (chenge color/ shadow of border to mach chosen project color)
         //     show the project view
        let outerSphere   = angular.element(document.querySelector('.project-sphere-outer'));
        let projectView   = angular.element(document.querySelector('.project-view'));
        let pickedOnLine  = angular.element(document.querySelector('.pick-'+ side.name)); // Text near sphere 

                         
        let previousProject = main.pickedProject;
        let project = side.name;
        let delay = 200; // 200 ms

        function showProject (async){
          
           main.pickedProject = side;                   // update model
           if(async) mainScope.$apply();                // triggers digest cycle only for main scope 

           outerSphere.removeClass('hide-corona'); 
           outerSphere.addClass(project + '-corona')   // t2 add this project corona
           
           projectView.addClass(project + '-border')    //  t2 add project border color / shadow
           projectView.removeClass('hide-view')         //  t2 show the projec-view 
 
           pickOnLine();
        }

        function hideProject (){                        // t1
           outerSphere.addClass('hide-corona');         // project was picked previously, hide its corona
           projectView.addClass('hide-view');           // hide the view
          
        }
     
        function clean(){                               // remove classes that we added on last click/pick
           outerSphere.removeClass(previousProject.name + '-corona');
           projectView.removeClass(previousProject.name + '-border');
        } 



        function pickOnLine (){
           if(main.previousPickedOnLine) 
               if(main.previousPickedOnLine !== pickedOnLine) 
                  main.previousPickedOnLine.removeClass(previousProject.name + '-on-line')
          
           pickedOnLine.addClass(project + '-on-line');
           main.previousPickedOnLine = pickedOnLine;            
        }

        if(previousProject){           // a project was picked previously

           hideProject();           // hide corona and project view

           setTimeout(function(){  // show projects corona, add its border and show the project
              clean();
              showProject(true);
           }, delay)
           
        }
        else showProject();       // first pick, just add its corona, add border and show project

             
     }

     return showProject
 })

angular.module('Portfolio.Home')
 .factory('ShortenOnSmallScreensService', function($window){ // DELETE THIS SERVICE

      function shortenOnSmallScreens(){  // detect sceens smaller then 400px 
         return angular.element($window).outerWidth() <= 400 ? true : false;    
      }

      return shortenOnSmallScreens;
 })

angular.module('Portfolio.Home')             // move it to Portfolio.Common it beleongs there,
                                                                     // since  its generic tmpl pull
 .directive('getcontent', function(CalculateOffsetService){
     
     let scope_ ; 
      console.log('GET CONTENT directive') 
     
     let linker = function(scope, elem, attrs, ctrl){
     
         scope_ = scope;
         console.log('GetContent side: ', scope.side.name)
     }

     return {
    
       restrict: 'A',
        link: linker,
        templateUrl: function(elem, attrs){
           
           console.log('getcontent elem **: ', elem)
           console.log('scope_ :', scope_); 
           return 'client/src/portfolio/Home/tmpl/home.html'
        }
     }
 })

angular.module('Portfolio.Common', ['Portfolio.Home']);

angular.module('Portfolio.Common')
  .service('CalculateOffsetService', function(){   // service calculates how much each side of the cube (box)
                                               // needs to move in z axis direction (in order to form cube)

      let calculateOffset = this;

       calculateOffset.calc = function(args){
                                                        // horisontal(x-axis) and (z-axis) sides we move
              let position = args.position;             // in relation to parent's width. Those are: 
              let Width    = args.width;                // left, right and front, back)
              let Height   = args.height; 
            
              if(position !== 'top' && position !== 'bottom'){
                 return Math.floor(Width/2);      
                                                               
              }
              else                   
                return Math.floor(Height/2)              // vertical (top, bottom) move in relation 
                                                         // to parent's height
           

      }
 })

angular.module('Portfolio.Common')
 .service('RotateCubeEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('rotateCube',side) }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('rotateCube', func)};        // set listener for event
 })

angular.module('Portfolio.Common')
 .factory('PositionService', function(CalculateOffsetService){


      function Position(domParams, cssParams){  // Position element on z-axis  and optionaly rotate it

         let elem  = domParams.elem;
         let scene = domParams.scene;
         let side  = domParams.side;

         let sign      = cssParams.sign || "";         // Offset sign for translateZ
         let rotate    = cssParams.rotate ;            // Priority (order) of rotation string in css string 
         let rotateY   = cssParams.rotateCube ? side.rotateCube: side.rotateSide;  // Passs rotation string for
                                                                                    // element we want ot rotate
         
         
          
         let offset = CalculateOffsetService.calc({         // Calculate z-axis offset (how much we move element)
              position: side.position,                      // Position of side we want to show
              width:    scene.outerWidth(),                 // 'scene' is reference element where 3D space is set
              height:   scene.outerHeight()
         })

         let transformStr = ''                            // string for css transform property
	 
         let translateZ = ' translateZ('+ sign + offset +'px) ';  // set the sign of the offset

         if(rotate === 'first') transformStr = rotateY + translateZ; // First rotate the element then offset it
         if(rotate === 'last')  transformStr = translateZ + rotateY; // Add rotation last

         if(!rotate) transformStr =  translateZ;                     // Just offset element without rotation
          

                                                 console.log("PositionService: ",transformStr);
         elem.css({
             transform: transformStr                                    // set elements css
         }) 
      }

      return Position;

 })

angular.module('Portfolio.Common')
 .service('EqualDimensionsEventService', function($rootScope){ // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('setEqualDimensions') }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('setEqualDimensions', func)};        // set listener for event
 })

angular.module('Portfolio.Common')
 .factory('HidesAddressBarEventService', function($window, ADDRESS_BAR_HIDDEN){ // Checks if browser 
                                                          // (usualy on mobile) hides address 
                                                          // bar in order not to trigger EqualDimension service
                                                          // so we don't have page size chop off in the  middle
                                                          // of scroll.
   function hidesAddressBarFix(){   // Puts flags that make EqualDimension(..) NOT execute when browser
                                    // hides address(url) bar

      let window_ = angular.element($window);
      
      window_.on('touchmove', function(){ // Mark potential address bar hide on resize event, after touchmove evt
                                          console.log('::touchMove event')
          ADDRESS_BAR_HIDDEN.value = true;
          ADDRESS_BAR_HIDDEN.counter = 6;   // set counter number, since afther touchmove we have resize event
      }); 

      window_.on('orientationchange', function(){ console.log(' ~~ orientation-CHANGE ~~');
          
          ADDRESS_BAR_HIDDEN.value = true;             // If there was flag set before this event, clean it
          ADDRESS_BAR_HIDDEN.counter = 6;
      });
    } 
    
    return hidesAddressBarFix;
 })

angular.module('Portfolio.Common')
 .factory('NotShownPagesCleanService', function(){
   
     function notShownPagesClean(CURRENT_SIDE, pageName){
         
        for(let name in CURRENT_SIDE.toBeShown){ 
              
             if(name !== pageName){ clearTimeout(CURRENT_SIDE.toBeShown[name])}

        };

     }
    
     return notShownPagesClean
 })

angular.module('Portfolio.Common')
 .factory('EqualDimensionsService', function(CURRENT_SIDE, ADDRESS_BAR_HIDDEN, RESIZE_EVENT,
                                              NotShownPagesCleanService){ // set element's height and width 
                                                                         // to be just like window's
                                                          // all in order for a cube/box to rotate without pages 
                                                          // sticking out form each other
             
       function EqualDimensions(args){
             console.log("ADDRESS_BAR_HIDDEN: ", ADDRESS_BAR_HIDDEN.value, " RESIZE_EVENT: ", RESIZE_EVENT.value) 
           if(ADDRESS_BAR_HIDDEN.value && RESIZE_EVENT.value){ // Address bar is hiden and EqualDims(..) fired
                                                               // on resize event
                                                 console.log("EqualDimensions DOESNT fire:", args.page)
                ADDRESS_BAR_HIDDEN.counter--;       // decrease counter uppon each of 6 EqualDimensions(..) calls
                if(ADDRESS_BAR_HIDDEN.counter === 0) ADDRESS_BAR_HIDDEN.value = false;   

                return;                                        // Browser hided address bar, don't chop off page
           }
     
           console.log('EqualDimensions fires:', args.page)
           let sceneHeight = args.scene.outerHeight() + 'px'; //  Height of the scene elment (root elment where 
                                                              //  3D context is set)
           let sceneWidth  = args.scene.outerWidth() + 'px';  //  Width of the scene


           let page        = args.page;        //  Page is the html root element for that side
           let attrs       = args.attrs;       //  Side is ancestor of the page element
           let pageName    = attrs.class;
               pageName    = pageName.substring(0, pageName.indexOf('-wrapper')) // get page NAme


           page.css({                          // set high and width to be just like window height and width
               height: sceneHeight,
               width:  sceneWidth,
               overflow: 'hidden'
           })
          
           if(CURRENT_SIDE.value.name === pageName){ // if we are on the side the is shown to the user
               console.log("SHOWN SIDE IS -> ", pageName)
              // remove any not pageName from sides to be shown
              NotShownPagesCleanService(CURRENT_SIDE, pageName);
              
              CURRENT_SIDE.toBeShown[pageName] = setTimeout(function removeEqualDimensions(){// Return dimensions
                                                                         // after one sec to page default values
                   let lateralSide = (pageName !== "quote-owlet" && pageName !== 'twiz-client') // Check if
                                                                        //  we are on any lateral side of the box
                   page.css({
                      height: lateralSide ? 'initial' : sceneHeight ,  // sceneHeight we need for top and bottom
                                                                       // page scroll bug 
                      width: 'initial',  
                      overflow: lateralSide ? 'visible': 'auto'  // was 'visible' check this on any cross 
                                                   // browser issues with vertical scroll on top and bottom pages
                   })
              }, 1000)                                    // 1s is the time the cube rotates to any of it's side
 
           }
       };

       return EqualDimensions;
 });

angular.module('Portfolio.Common')
 .service('HideTopAndBottomEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(){console.log('hidetopandbottom BROADCAST'); $rootScope.$broadcast('hideTopEndBottom') };   // broadcast event
      this.listen    = function(func){ console.log('hidetopandbottom LISTENER');$rootScope.$on('hideTopEndBottom', func)}; // set listener for event
 })

angular.module('Portfolio.Common')
 .factory('HideTopAndBottomService', function(CURRENT_SIDE){

      let ref = {          // ref will save timeout in order to be cleared/removed when fastclicking sides happen
         timeouts: []
      }
                                                           // DO THIS only when window.height > window.width !!!
      function htab(){
         
         let current_position  = CURRENT_SIDE.current_position;
         let previous_position = CURRENT_SIDE.previous_position;

                                              console.log('in htab');
                                              console.log('current_position:', current_position);
                                              console.log('previous_position:', previous_position);
         let shown    = current_position;
 
         let top    = angular.element(document.querySelector('.twiz-client')) // top side  
         let bottom = angular.element(document.querySelector('.quote-owlet')) // bottom side

         if( shown !== 'top' && shown !== 'bottom'){  console.log('LATERAL --')
         
           let dim = {
              display: 'block',
              opacity: '1',
              transition: 'opacity .4s cubic-bezier(1.000, 0.025, 1.000, -0.185) .6s',// slow beggining, fast end
              opacity: '0'                         
           }

           let remove =  {
              display:'none'
           }

           top.css(dim);                // dim top and bottom 
           bottom.css(dim);

           ref.timeouts.push(setTimeout(function(){// Remove them from flow in order for top and bottom sides not
                                                  // to stick out from the edges of the window/tab. Save timeout.
                   top.css(remove);
                   bottom.css(remove) 
           }, 1000))                                // 1s - since the cube rotates that much time to show a side
           
         }
         else{
            
            if (previous_position === 'top' || previous_position === 'bottom') return; 
                                      // if we were on top or bottom do nothing
            for(var i in ref.timeouts){ clearTimeout(ref.timeouts[i]) };
           
            let show = {
               display: 'block',
               opacity: '0',
               transition: 'opacity .2s cubic-bezier(0.025, 1.170, 0.000, 0.960) ', // fast beggining, slow end
               opacity: '1'
             }

            top.css(show);
            bottom.css(show); 
         }
      }

     return htab
 })

angular.module('Portfolio.Common')
 .service('SetNavbarEventService', function($rootScope){  // make a service so we can use dependencu injecton 
                                                           // to easy spot what components use it 
      
      this.broadcast = function(side){ $rootScope.$broadcast('setNavbar') }; // broadcast event
      this.listen    = function(func){ $rootScope.$on('setNavbar', func)};        // set listener for event
 })

angular.module('Portfolio.Common')
 .factory('SetNavbarService', function(NAVBAR_POSITION, GetNavbarCssClass){
     
       // select screen-edge, nav, add classes for switching positions
       // if navabr is shown move it out of the screen, if navbar is not shown place it on screen 
 
       function setNavbarService(){ // Shows/Hides navbar. Is set to fire on click event(see SetNavbar directive)

           let navbar     = angular.element(document.querySelector('.navbar'))      // the real navbar
           let screenEdge = angular.element(document.querySelector('.screen-edge')) // abstraction of screen edge
           let nav        = angular.element(document.querySelector('.nav'))         // abstraction of navbar 
         //  let window_    = angular.element(window);

           let vertical   = navbar.outerHeight() > 100 ? true : false;     // check how navbar is positioned
           let horizontalHide = GetNavbarCssClass()    // get css class for this screen width
          
           if(NAVBAR_POSITION.shown){
               if(vertical){

                    navbar.addClass('navbar-vertical-hide');
                    screenEdge.addClass('screen-edge-vertical-hide');
                    nav.addClass('nav-vertical-hide');
               }
               else{                    // it is in horisontal position 
                   console.log("IS HORIZONTAL")
                   navbar.addClass('navbar-' + horizontalHide);
                   screenEdge.addClass('screen-edge-horizontal-hide');
                   nav.addClass('nav-horizontal-hide');
               }

              
           }
           else {                                            // Not shown on page
               if(vertical){                                 // Had vertical position
                                   
                  navbar.removeClass('navbar-vertical-hide');            // shows navbar
                  screenEdge.removeClass('screen-edge-vertical-hide');   // repositions screen edge abstraction
                  nav.removeClass('nav-vertical-hide');                  // reposition navbar abstraction 
               }
               else {                                                   
                   navbar.removeClass('navbar-' + horizontalHide);
                   screenEdge.removeClass('screen-edge-horizontal-hide') // repositions screen adge abstraction
                   nav.removeClass('nav-horizontal-hide');
               }
           }

           NAVBAR_POSITION.shown = NAVBAR_POSITION.shown ? false : true; // toggle shown flag   
       }

       return setNavbarService;
 })

angular.module('Portfolio.Common')
 .factory('GetNavbarCssClass', function($window){

      function getNavbarCssClass(remove){

          let windowWidth = angular.element($window).outerWidth();       // get screen width
          let navbarClasses = ['horizontal-hide', 'horizontal-hide2', 'horizontal-hide3']
          let class_;

           if(windowWidth > 440)
              class_ = navbarClasses[0];                  // name of css class we want to add/remove when 
                                                        // screen > 440
           if(windowWidth >= 321 && windowWidth <= 440)
              class_ = navbarClasses[1];

           if(windowWidth < 366)
              class_ = navbarClasses[2];

           if(remove){
              navbarClasses.splice(navbarClasses.indexOf(class_),1); // remove class that we planed for a screen size
              return navbarClasses;                           // return classes that are NOT planed for a 
                                                              // screen size
           }

          return class_
      }
 
      return getNavbarCssClass;
 })

angular.module('Portfolio.Common')
 .factory('RemoveNavbarCssClass', function(GetNavbarCssClass, NAVBAR_POSITION, $window){

     function removeNavbarCssClass (){  // is set on resize event (see setnavbar directive)

        let navbar = angular.element(document.querySelector('.navbar'));
        let vertical = angular.element($window).outerWidth() >= 1024 ? true : false; // make a service
        
        if(vertical){ 
            navbar.removeClass('navbar-horizontal-hide navbar-horizontal-hide2 navbar-horizontal-hide3');
           if(!NAVBAR_POSITION.shown){
             navbar.addClass('navbar-vertical-hide'); // when switched to vertical 
             console.log("FINESE")
           }                                                                   // from hidden horizontal, 
        }                                                                      // add vertical-hide
        else
            navbar.removeClass('navbar-vertical-hide');    // if horizontal, remove vertical class artefact

        if (angular.element($window).outerWidth() >= 1024) return; // do the rest only when screen width < 1024
        if(NAVBAR_POSITION.shown) return ; // only when navbar is hidden do the rest

        let remove = GetNavbarCssClass(true);
        let add    = GetNavbarCssClass();   
        let len = remove.length;
         console.log('RemoveNavbarCssClass:', remove) 
         console.log('AddNavbarCssClass:', add)
        

        navbar.addClass('navbar-' + add); // first add one that we need

        for(var i = 0; i < len; i++){
            
            navbar.removeClass('navbar-' + remove[i]);
        } 
       
     }

    return removeNavbarCssClass;
 })

angular.module('Portfolio.Common')
 .factory('SelectNavbarOptionService', function(CURRENT_SIDE){
    
      return function selectNavbarOption(sides){
             
           if (CURRENT_SIDE.previous_position === CURRENT_SIDE.current_position) return;// same option is clicked 
           
           let prevSelected;
                                         console.log('IN SELECT NAVBAR Option:::')
           for(let i in sides){

                let side = sides[i];
                if(side.position === CURRENT_SIDE.previous_position){
                   
                  
                   prevSelected = angular.element(document.querySelector('.nav-' + side.name));
                       console.log('prevSelected:', prevSelected);
                   prevSelected.removeClass('selected'); // unselect previously selected navbar option
                }
           }

           let side = CURRENT_SIDE.value;
           let newSelected = angular.element(document.querySelector('.nav-' + side.name));// currentSide
                                                                                          // becomes newSelected
            console.log("NEw SElected:", side.name)
     //      newSelected.selected = true;                   // mark it as selected
           newSelected.addClass('selected');              // add animation to selected navbar option
      } 
 })

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

angular.module('Portfolio.Common')
 .directive('positionside', function(PositionService, $window){

      console.log('positionSide directive')

      let linker = function(scope, elem, attrs, ctrl){
              //  console.log('scope:', scope) 
           
              let domArgs = {
                 'side' : scope.side,                             // reference of the side from ng-repeat 
                 'elem' : elem,                                   // jquery wrapper on dom object
                 'scene': angular.element(document.querySelector('.scene'))
              }
              
              let cssArgs = {                                  
                 rotateSide: true,                           // We re position side
                 rotate: 'first'                            // first we are going to rotate side element
              }

              let PositionSide = PositionService.bind(null, domArgs,cssArgs) // Position side in order to form
                                                                             // box/cube
              if(attrs.class.indexOf(scope.side.name) !== -1)      
                 PositionSide();                                         // position side when directive is added 

              angular.element($window).on('resize', PositionSide);      // Do the same when window size changes
              
              scope.$on('$destroy', function(){
                 angular.element($window).off('resize', PositionSide); // When scope dies prevent leaks    
              })
       }

       return {
          restrict: 'A',
          link: linker
       }
 })

angular.module('Portfolio.Common')
 .directive('positioncube', function($window, CURRENT_SIDE, PositionService){

     let linker = function(scope, elem, attrs){

                              // get reference to currently shown side 
        
         let domArgs = { 
            'side' : '',
            'elem' : elem,                                             // Cube element
            'scene': angular.element(document.querySelector('.scene')) // Element with 3d contect set
         }

         let cssArgs = {
            sign:'-',            // Sign for z-axis offset we use to position cube
            rotateCube: true,    // We are positioning cube element
            rotate: 'last'       // Add rotation information last 
         }

         function PositionCube(){
           
            domArgs.side = CURRENT_SIDE.value;   // To correctly position in reference to currently shown side
              	console.log('positionCube - CURRENT_SIDE.value.position', CURRENT_SIDE.value.position)

            PositionService(domArgs, cssArgs);
            
         }

         PositionCube();
         
         let window_ = angular.element($window);  
         
         window_.on('resize', PositionCube)                // Reposition cube on any window size change, to keep
                                                           // page look clean and not fuzzy.
        
         scope.$on('destroy', function(){ 
            window_.off('resize', PositionCube)            // When scope is gone remove listener to prevent mem.
                                                           // leaks.
         })

     }
 
    
     
     return {
        restrict: 'A',
        link: linker
     }  
 })

angular.module('Portfolio.Common')
 .directive('rotatecube', function(RotateCubeEventService, PositionService){

      let linker = function(scope, elem, attrs, ctrl){
             let cube = elem;
                                                       console.log('rotateCube directive')
            
             let domArgs = {
                  'side' : '',
                  'elem' : elem,                                             // cube element
                  'scene': angular.element(document.querySelector('.scene')) // element with 3d context set
             };
  
             let cssArgs = {
                 sign: '-',                               // Sign of traslateZ css parametar
                 rotateCube: true,                       // Rotating cube element
                 rotate: 'last'                          // Add rotation css string last 
             };


             function RotateCube(){
                                                          console.log('cubeRotated@@');
                domArgs.side = arguments[1];       // side is passed as second argument to listener
                PositionService(domArgs, cssArgs)  // Rotate the cube 
             }
             
             RotateCubeEventService.listen(RotateCube);

      } 


      let controller = function($scope){
         rotateCube = this;
         rotateCube.print = function(){
 
           console.log('cube rotated');
         }
      }

      return {
        restrict: 'A',
        link: linker,
        controller: controller
      }
 })

angular.module('Portfolio.Common')

 .directive('equalDimensions', function($window, EqualDimensionsService, EqualDimensionsEventService,
                                         RESIZE_EVENT){

       let linker = function(scope, elem, attrs, ctrl){
          console.log('equalDimensions DIRECTIVE')
          let scene = angular.element(document.querySelector('.scene'));
           // console.log('sceneHeight', scene.outerHeight());

          function EqualDimensions(){  // on broadcasted event set page dimensions 

             EqualDimensionsService({
                 page:   elem,
                 attrs:  attrs,
                 scene: scene
             })
          }

          EqualDimensionsEventService.listen(EqualDimensions);    // Set listener for any broadcast events
          
          function EqualDimensionsOnResize(){
                                              console.log('EqualDimensions on RESIZE_EVENT')
              RESIZE_EVENT.value = true;                         // Mark that EqualDims was called on resize evt
              EqualDimensions();
          }

          angular.element($window).on('resize', EqualDimensionsOnResize); // Do the same when window size changes
              
          scope.$on('$destroy', function(){
             angular.element($window).off('resize', EqualDimensionsOnResize); // When scope dies prevent leaks    
          })
 

       }

       return {
          restrict: 'A',
          link: linker
       }
 })

angular.module('Portfolio.Common')
 .directive('hideTopAndBottom', function(HideTopAndBottomEventService, HideTopAndBottomService){

      let linker = function(scope, elem, attrs){

         console.log('HideTopAndBottom DIRECTIVE');
          HideTopAndBottomEventService.listen(function(){
         
               HideTopAndBottomService(); // check what needs to be redone in the main controler
          })
         
          HideTopAndBottomEventService.broadcast();  // hide top and bottom on initial directive compile
      } 

      return {
        restrict: 'A', 
        link: linker
         
      }
 })

angular.module('Portfolio.Common')
 .directive('setNavbar', function(SetNavbarEventService, SetNavbarService, RemoveNavbarCssClass, $window){

      let linker = function(scope, elem, attrs){
        
         SetNavbarEventService.listen(function(){
             SetNavbarService();
         })
         
         let window_ =  angular.element($window);

         window_.on('resize', RemoveNavbarCssClass)
         scope.$on('destroy', function(){
             window_.off('resize', RemoveNavbarCssClass);
         })
      }

 
      return {
         restrict: 'A',
         link: linker
      }
 })

angular.module('Portfolio.QuoteOwlet', ['Portfolio.Common'])

angular.module('Portfolio.QuoteOwlet')
 .service('AnimationService', function(){
     
     let  animation = this;

     animation.preQuote = function(num){  // adds css class to a given quote elements specified with 'num'
        this[num] = {};
  
        this[num].quote  = angular.element(document.querySelector('#_'+ num));           // Get quote element
        this[num].text   = angular.element(document.querySelector('#_'+ num + " .text"));// Text of quote in 'num'
        this[num].author = angular.element(document.querySelector('#_'+ num + " .author")); // Author of quote ..
        // console.log('quote Animation ::: ', quote);
        // add on click animations
       
        this[num].quote.addClass('quote-on-click') 
        this[num].text.addClass('text-on-click');
        this[num].author.addClass('author-on-click')
     };

 
     animation.postQuote = function(num){
        this[num].quote.removeClass('quote-on-click');
        this[num].text.removeClass('text-on-click');
        this[num].author.removeClass('author-on-click');
     };
         
     
 })

angular.module('Portfolio.QuoteOwlet')
 .factory('FormEncodeService', function($window){

     function formEncode(dataObj, spaces){
        var pairs = [];
        var value;
        var key;
        var type;

        for(var name in dataObj){
            type = typeof dataObj[name];

             if(dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null"){ // only props 
                                                                                                 // in dataObj 

                  let encodeURIComponent = $window.encodeURIComponent

                  key = encodeURIComponent(name);   // encode property name

                  if(type === 'object'){                         
                     value = formEncode(dataObj[name], spaces); // form encode object
                     value = encodeURIComponent(value)          // since return value is string, uri encode it
                  }                      
                  else value = encodeURIComponent(dataObj[name]) // property is not object, just uri encode it
                  
                  if(!spaces){
                     key = key.replace(/%20/g, "+") 
                     value = value.replace(/%20/g, "+"); // substitute space encoding for +
                  }
                 
                  pairs.push(key + "=" + value)                 
             }
         }

         return pairs.join("&");
     }

     return formEncode;
})

angular.module('Portfolio.QuoteOwlet')
 .service('UtilsService', function(){
    
     let utils = this;

     utils.parseQuote = function(response){      // Parses quote text and quote author from string 
       if(response.data.length !== 0){
         let q = response.data             // Take string that server has sent
                                            // Server response is in text format like bellow:
                                            // This is the quote string. (Here goes the author)  
         
         let quoteEnd = (q.indexOf("(") === -1) ? q.length : (q.indexOf("(") - 1); // Get index of the "(" - 1. 
                                                                                   // Emty space before "(" .
         var quoteText = q.substring(0,quoteEnd);   // Get quote string up to dot(including).
        
         let authorEnd = q.indexOf(")");
         var quoteAuthor = "";

         if(authorEnd !== -1) quoteAuthor = q.substring(quoteEnd+2, authorEnd);// Get author string, 
                                                                               // up to ")" . If there is one.
       }
       else{
           console.log('There is no quote string from server ...');
           return;  
       }
        
       return { 'text': quoteText , 'author': quoteAuthor}; // return quote text and quote author
     }
     
 })

angular.module('Portfolio.QuoteOwlet')
 .service('ConfigureRequestService', function(FormEncodeService){ // sets config object used to fetch a quote
                                                                  // from server

      let crs = this;

      crs.config = {
         method: "GET",    
         url: ""
      } 

      crs.setUrl = function(){
         this.url = 'https://quoteowlet.herokuapp.com/fetch/https://api.forismatic.com/api/1.0/'// Server address
                                                                                               // with endpoint.
                                                                                               // (is proxy serv)
         console.log('this.url:', this.url) 
         this.queryParams = {      // making params object specific to server endpoint we are connnecting to. 
             method: 'getQuote',
             format: 'text',
             key: 0,
             lang: 'en'
         };   
        
         this.setQuoteKey = function(){ // sets random quote key that server is using to generates data.
            let value = Math.round( Math.random() * 100000); 
            this.queryParams.key = value ;

         }
         
            
         this.setQueryString = function(){
            this.queryString = FormEncodeService(this.queryParams);// Service uses form-url-encoded scheme to return
                                                           //  query string
           
            if(this.url.indexOf("?") === -1) this.url+="?"; // if doesnt have query delimiter add it. 
            this.url+= this.queryString; // Adds query string to url 


         };
 
         this.setQuoteKey();   // set random quote number
         this.setQueryString() // add query string to url

         this.config.url = this.url // set config url
      }
  
 
      crs.init = function(){ 
         
         crs.setUrl();
         return crs.config 
      } // return config object for a request; 
 })

angular.module('Portfolio.QuoteOwlet')
 .factory('GetQuoteModel', function($http, ConfigureRequestService, UtilsService){

     function getQuote(){
       return $http(ConfigureRequestService.init())
                .then(function success(data){
                                
                    return UtilsService.parseQuote(data);
                }
                 , function failure(err){
                     console.log('error --> :', err)
                }) 

     }

     return getQuote;
 })

angular.module('Portfolio.QuoteOwlet')
 .controller('QuoteOwletCtrl', function($scope, GetQuoteModel, AnimationService){ // GetQuote MODEl
    
      let owletCtrl = this;

      owletCtrl.quotes = {
         '1': { 
             text: "Setting an example is not the main means of influencing another, it is the only means.",
             author:'Albert Einstein'
         },
         '2': {
            text:'What lies behind us and what lies before us are small matters compared to what lies within us. ',
            author:'Oliver Holmes'
         },
         '3': {
            text:'I am always doing that which I cannot do, in order that I may learn how to do it.',
            author: 'Pablo Picaso',
         },
         '4': {
            text:'When I let go of what I am, I become what I might be. ',
            author:'Lao Tzu'
         }
      }
     

      owletCtrl.updateQuote = function(num) {
           GetQuoteModel()
           .then(function(quote){
                console.log("in owletCtrl quote:", quote)
    
               
                setTimeout(function(){                   // delay model update while post quote animation lasts
                   $scope.$apply(function(){

                      AnimationService.postQuote(num);     // css animation after we get quote data
                      this.quotes[num].text   = quote.text;
                      this.quotes[num].author = quote.author;
                   }.bind(owletCtrl))
                }, 400);
                  
           }.bind(this)
            , function(err){
               console.log('GetQuoteModel error: ', err );
           }) 
                  
           AnimationService.preQuote(num);           // css animation before we get quote data
      } 
 })

angular.module('Portfolio.HmacSha1', ['Portfolio.Common'])

angular.module('Portfolio.HmacSha1')
 .factory('CreateHashStringService', function(){

     return function createHashString(){
         
        let alphaNums = '5ab1cd4e2f0g3h7ij4kl6mn2o8pqr9stu0vwxy1z';
        let length = alphaNums.length -1 ;
        let hash = '';
        let k; // index

        for (let i = 0; i < 40; i++){
            k = Math.round( Math.random() * length); // Make index number random, goes up to aplhanum.length
            hash += alphaNums[k];                    // Take char from k-th place in alphaNums and put in hash
        }
      
        return hash;
     }

     
 })

angular.module('Portfolio.HmacSha1')
 .factory('HideNumbersService', function(){
   

    return function hideNumbers(){
     
      let hashNums = document.querySelectorAll('.hash-num'); 
      let len = hashNums.length;

      if( len === 0) return;
         
      for(let i = 0; i < len; i++){
        
           let num = angular.element(hashNums[i]);
           num.addClass('hash-num-hide');

          
      }
      

    }
 })

angular.module('Portfolio.HmacSha1')
 .factory('AnimateApstractionService', function(){

     // get all 3 dotted border elements
     // add css classes 
     let rows = []
     rows.push(angular.element('#r1'));
     rows.push(angular.element('#r2'));
     rows.push(angular.element('#r3'));
     
     function jqClass(action){           // uses jquery addClass or removeClass
        let command = action + 'Class';  // make jquery function name
        for (let i in rows){
          let k = Number(i);
             rows[i][command]('border-color-'+ (++k)) // adds or removes css class
        }

     }

     return function animateApstraction(){
       
      
            jqClass('add');

        let interval = 700;
        setTimeout(function(){
            jqClass('remove');
        }, interval += 120)
     }

 })

angular.module('Portfolio.HmacSha1')
 .factory('AnimateHashNumbersService', function($window, CreateHashStringService){

     // take element that will contain numbers 
     // produce hash string of 40 chars
     // add numbers one by one to container
     // add css classes to numbers
    return function animateHashNumbers(){

       let windowSize = angular.element($window).innerWidth();
       let hash_El = angular.element(document.querySelector('.hash')) // get reference of container
       let hash    = CreateHashStringService();                       // generate hash numbers

       if(windowSize < 414) hash = hash.slice(0,-5);           // cut off last 5 numbers (so string can fit
                                                                // screen without having to decrese font size)
       hash_El.empty();    // remove eny previous hash numbers

       let interval = 0;  // 
       
       for(let i in hash){

              hash_El.append('<span class="hash-num" id="h_'+i +'">'+ hash[i] +'</span>'); // append a number
              let span = angular.element(document.querySelector('#h_'+i));                 
              
             setTimeout(function() {
                 span.addClass('drop-number');
              }, interval +=60 )               // every 60 ms drop a number

       }
    }
  
 })

angular.module('Portfolio.HmacSha1')
 .controller('HmacSha1Controller', function(AnimateHashNumbersService, AnimateApstractionService, HideNumbersService){

    let hs1Ctrl= this;
   
    hs1Ctrl.animateHashNumbers = function (){ 
       AnimateApstractionService(); 
       
       setTimeout(function(){
         HideNumbersService();
       }, 460);

       setTimeout(function(){
          AnimateHashNumbersService();
       },750);
   }
 })

var portfolio = angular.module('Portfolio', [
    'ngAnimate',
    'ngRoute',
    'ngMessages',
    'Portfolio.Common',
    'Portfolio.QuoteOwlet',
    'Portfolio.HmacSha1'
])

portfolio.config(function($routeProvider){
   
      $routeProvider
        .when('/', {    // root will point to page with full page cude animation

           templateUrl:  'client/src/portfolio/Common/tmpl/main.html',
           controller:   'MainCtrl',
           controllerAs: 'main'
        })
})
