angular.module('Portfolio.Home', []);

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
 .factory('EqualDimensionsService', function(CURRENT_SIDE){ // set element's height and width to be just like window's
                                                // all in order for a cube/box to rotate without pages 
                                                // sticking out form each other 

       
       function EqualDimensions(args){

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
              setTimeout(function removeEqualDimensions(){ // return dimensions after one sec to page default values
                   page.css({
                      height: 'initial',
                      width: 'initial',
                      overflow: 'visible',
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
    return function(input){
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
 .controller('MainCtrl', function($scope, CURRENT_SIDE, NAVBAR_POSITION,
                                  RotateCubeEventService, EqualDimensionsEventService,
                                  HideTopAndBottomEventService, SetNavbarEventService,
                                  SelectNavbarOptionService){ 
   
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
          selected: ''
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
             desc: "Form of a digital signature",
             main: "Can produce hash string that is used to provide data integrity and authentication checks.",
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
          selected:''
        },
        {
          name: "twiz-server",          // "left"
          tittle:"",
          position:'left',
          rotateSide: "rotateY(-90deg)",  // Initail rotation this side has when cube/box forms
          rotateCube: 'rotateY(90deg)',   // Rotation that cube element needs to have in order to show this side
          url: 'client/src/portfolio/TwizServer/tmpl/twiz-server.html',
          selected:''
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

     main.setEqualDimensions = function(){ console.log('main.setEqualDimensions')
         EqualDimensionsEventService.broadcast(); // brodcast event for setting height and width to all sides
     }
 
     main.setCurrentSide = function(side){       // mark which side is currently shown
        CURRENT_SIDE.value     = side;           // ref to the side object

        CURRENT_SIDE.previous_position = CURRENT_SIDE.current_position || '';  // remember previous position
        CURRENT_SIDE.current_position  = side.position                          // set current position 
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
    
     main.projectsOnly = function(){
 
        return function(side){
          
            if(side.name !== 'cv' && side.name !== 'home') return true;
                   
        }  
     } 
 })
 .value('CURRENT_SIDE', { value:''}) // descibes currently shown side of the cube/box
 .value('NAVBAR_POSITION', { shown:''})

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

 .directive('equalDimensions', function($window, EqualDimensionsService, EqualDimensionsEventService){

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

          EqualDimensionsEventService.listen(EqualDimensions)
          
          angular.element($window).on('resize', EqualDimensions);      // Do the same when window size changes
              
          scope.$on('$destroy', function(){
             angular.element($window).off('resize', EqualDimensions); // When scope dies prevent leaks    
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

var portfolio = angular.module('Portfolio', [
    'ngAnimate',
    'ngRoute',
    'ngMessages',
    'Portfolio.Common'
])

portfolio.config(function($routeProvider){
   
      $routeProvider
        .when('/', {    // root will point to page with full page cude animation

           templateUrl:  'client/src/portfolio/Common/tmpl/main.html',
           controller:   'MainCtrl',
           controllerAs: 'main'
        })
})
