angular.module('Portfolio.Common',[]);

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
                return Math.floor(Height/2)          // vertical (top, bottom) move in relation 
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
 .controller('MainCtrl', function($scope,RotateCubeEventService){ // here goes model for all cube pages
   
     let main = this;

     main.sides = [
        {
          tittle: "",
          name: 'home',                   // front side
          position: 'front',
          rotate: "rotateY(0deg)",
          rotateCube: "rotateY(0deg)"
        },
        {
          name: "cv",                    // "back" or the cirriculum vitae
          tittle:"",
          position:'back',
          rotate: 'rotateY(180deg)',
          rotateCube: 'rotateY(-180deg)'
        },
        {
          name: "quote-owlet",          // "bottom"
          tittle: "",
          position: 'bottom',
          rotate: 'rotateX(-90deg)',
	  rotateCube: 'rotateX(90deg)'
        },
        {
          name: "hmac-sha1",            // "right"
          tittle:"",
          position:'right',
          rotate: "rotateY(90deg)",
          rotateCube: 'rotateY(-90deg)'
        },
        {
          name: "twiz-client",          // "top"
          tittle:"",
          position: 'top',
          rotate: 'rotateX(90deg)',
          rotateCube:'rotateX(-90deg)',
        },
        {
          name: "twiz-server",          // "left"
          tittle:"",
          position:'left',
          rotate: "rotateY(-90deg)",   // initail rotation this side has when cube/box forms
          rotateCube: 'rotateY(90deg)' // rotation that cube element needs to have in order to show this side
        }
     ];

      /*
           .cube.show-front  { transform: translateZ(-100px) rotateY(   0deg); }
           .cube.show-right  { transform: translateZ(-100px) rotateY( -90deg); }
           .cube.show-back   { transform: translateZ(-100px) rotateY(-180deg); }
           .cube.show-left   { transform: translateZ(-100px) rotateY(  90deg); }
           .cube.show-top    { transform: translateZ(-100px) rotateX( -90deg); }
           .cube.show-bottom { transform: translateZ(-100px) rotateX(  90deg); }
     */
           // console.log('$scope:',$scope)

     main.rotateCube = function(side){   // name of the side we wish to show
         RotateCubeEventService.broadcast(side);  // passing side to which service rotates cube/box
     }
     
     main.showSide = function(side){

     }
 })

angular.module('Portfolio.Common')
 .directive('positionside', function(CalculateOffsetService){

      console.log('positionSide directive')

      let linker = function(scope, elem, attrs, ctrl){
          //  console.log('scope:', scope) 
           
           
              let side = scope.side;                             // reference of the side from ng-repeat 
              let parent = elem.parent()[0];
           
              let scene = angular.element(document.querySelector('.scene'));
                       
              let sceneWidth  = scene.outerWidth()     //elem.parent()[0].clientWidth;   // get hight of the cube
              let sceneHeight = scene.outerHeight();   //elem.parent()[0].clientHeight;  // get width of the cube
              if(attrs.class.indexOf(side.name) !== -1){        // when side name is in class string
                  let offset = CalculateOffsetService.calc({           // calcualte offset for moving side 
                       position: side.position,
                       width:    sceneWidth,
                       height:   sceneHeight
                  }); 
                 
                  elem.css({                     // height and width are taken from scene in order for all sides
                                                 // to have perfect fit on window dimensions
                     transform: side.rotate + ' translateZ('+ offset +'px)'
                  })                                            // 'translateZ('+offset+'px)')
              }
      }

          
      

      return {
         restrict: 'A',
         link: linker,
      }
 })

angular.module('Portfolio.Common')
 .directive('positioncube', function(){

     let linker = function(scope, elem, attrs){
        let cube = elem; 
         console.log('positionCube directive')        
        let width = cube.outerWidth(); 

        elem.css({
           transform: 'translateZ(-' + Math.floor(width/2) + 'px)'
        })
     }

     return {
        restrict: 'A',
        link: linker
     }  
 })

angular.module('Portfolio.Common')
 .directive('rotatecube', function(RotateCubeEventService, CalculateOffsetService){

      let linker = function(scope, elem, attrs, ctrl){
             let cube = elem;
                                                       console.log('rotateCube directive')

             RotateCubeEventService.listen(function(){
                let side = arguments[1]; 
               
                                                          console.log('cubeRotated@@');
                                                           console.log('side:', side)

                let offset = CalculateOffsetService.calc({
                   position: side.position, // side on which position we want to show
                   width:    cube.outerWidth(),
                   height:   cube.outerHeight()
                })
                                                 console.log('translateZ(-' + offset + 'px) ' + side.rotateCube);
                cube.css({
                   transform: 'translateZ(-' + offset  + 'px) ' + side.rotateCube
                }) 
             })          
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
