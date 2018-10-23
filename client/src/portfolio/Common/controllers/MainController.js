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
