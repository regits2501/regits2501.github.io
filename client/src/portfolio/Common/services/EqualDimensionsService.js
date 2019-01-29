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
