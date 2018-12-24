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
