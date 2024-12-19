"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

angular.module('Portfolio.Home', []);
angular.module('Portfolio.Home').factory('ShowProjectService', function () {
  function showProject(side, main, mainScope) {
    // side , sides      , pickedProject
    // pick sphere and projectview to animate
    // t1 - when project is chosen (hide corona from sphere)
    //      add chosen project corona
    // t1 -same time dim the project view (chenge color/ shadow of border to mach chosen project color)
    //     show the project view
    var outerSphere = angular.element(document.querySelector('.project-sphere-outer'));
    var projectView = angular.element(document.querySelector('.project-view'));
    var pickedOnLine = angular.element(document.querySelector('.pick-' + side.name)); // Text near sphere 

    var previousProject = main.pickedProject;
    var project = side.name;
    var delay = 200; // 200 ms

    function showProject(async) {
      main.pickedProject = side; // update model

      if (async) mainScope.$apply(); // triggers digest cycle only for main scope 

      outerSphere.removeClass('hide-corona');
      outerSphere.addClass(project + '-corona'); // t2 add this project corona

      projectView.addClass(project + '-border'); //  t2 add project border color / shadow

      projectView.removeClass('hide-view'); //  t2 show the projec-view 

      pickOnLine();
    }

    function hideProject() {
      // t1
      outerSphere.addClass('hide-corona'); // project was picked previously, hide its corona

      projectView.addClass('hide-view'); // hide the view
    }

    function clean() {
      // remove classes that we added on last click/pick
      outerSphere.removeClass(previousProject.name + '-corona');
      projectView.removeClass(previousProject.name + '-border');
    }

    function pickOnLine() {
      if (main.previousPickedOnLine) if (main.previousPickedOnLine !== pickedOnLine) main.previousPickedOnLine.removeClass(previousProject.name + '-on-line');
      pickedOnLine.addClass(project + '-on-line');
      main.previousPickedOnLine = pickedOnLine;
    }

    if (previousProject) {
      // a project was picked previously
      hideProject(); // hide corona and project view

      setTimeout(function () {
        // show projects corona, add its border and show the project
        clean();
        showProject(true);
      }, delay);
    } else showProject(); // first pick, just add its corona, add border and show project

  }

  return showProject;
});
angular.module('Portfolio.Home').factory('ShortenOnSmallScreensService', function ($window) {
  // DELETE THIS SERVICE
  function shortenOnSmallScreens() {
    // detect sceens smaller then 400px 
    return angular.element($window).outerWidth() <= 400 ? true : false;
  }

  return shortenOnSmallScreens;
});
angular.module('Portfolio.Home') // move it to Portfolio.Common it beleongs there,
// since  its generic tmpl pull
.directive('getcontent', function (CalculateOffsetService) {
  var scope_;
  console.log('GET CONTENT directive');

  var linker = function linker(scope, elem, attrs, ctrl) {
    scope_ = scope;
    console.log('GetContent side: ', scope.side.name);
  };

  return {
    restrict: 'A',
    link: linker,
    templateUrl: function templateUrl(elem, attrs) {
      console.log('getcontent elem **: ', elem);
      console.log('scope_ :', scope_);
      return 'client/src/portfolio/Home/tmpl/home.html';
    }
  };
});
angular.module('Portfolio.Common', ['Portfolio.Home']);
angular.module('Portfolio.Common').service('CalculateOffsetService', function () {
  // service calculates how much each side of the cube (box)
  // needs to move in z axis direction (in order to form cube)
  var calculateOffset = this;

  calculateOffset.calc = function (args) {
    // horisontal(x-axis) and (z-axis) sides we move
    var position = args.position; // in relation to parent's width. Those are: 

    var Width = args.width; // left, right and front, back)

    var Height = args.height;

    if (Height > Width) {
      // This code branch sets sides for ShimTheWhiteSpace() 
      if (position === 'front' || position === 'back') return Math.floor(Height / 2); // move both in 
      // relation to Height
    }

    if (position !== 'top' && position !== 'bottom') {
      return Math.floor(Width / 2);
    } else return Math.floor(Height / 2); // vertical (top, bottom) move in relation 
    // to parent's height

  };
});
angular.module('Portfolio.Common').service('RotateCubeEventService', function ($rootScope) {
  // make a service so we can use dependencu injecton 
  // to easy spot what components use it 
  this.broadcast = function (side) {
    $rootScope.$broadcast('rotateCube', side);
  }; // broadcast event


  this.listen = function (func) {
    $rootScope.$on('rotateCube', func);
  }; // set listener for event

});
angular.module('Portfolio.Common').factory('PositionService', function (CalculateOffsetService) {
  function Position(domParams, cssParams) {
    // Position element on z-axis  and optionaly rotate it
    var elem = domParams.elem;
    var scene = domParams.scene;
    var side = domParams.side;
    var sign = cssParams.sign || ""; // Offset sign for translateZ

    var rotate = cssParams.rotate; // Priority (order) of rotation string in css string 

    var rotateY = cssParams.rotateCube ? side.rotateCube : side.rotateSide; // Passs rotation string for
    // element we want ot rotate

    var offset = CalculateOffsetService.calc({
      // Calculate z-axis offset (how much we move element)
      position: side.position,
      // Position of side we want to show
      width: scene.outerWidth(),
      // 'scene' is reference element where 3D space is set
      height: scene.outerHeight()
    });
    var transformStr = ''; // string for css transform property

    var translateZ = ' translateZ(' + sign + offset + 'px) '; // set the sign of the offset

    if (rotate === 'first') transformStr = rotateY + translateZ; // First rotate the element then offset it

    if (rotate === 'last') transformStr = translateZ + rotateY; // Add rotation last

    if (!rotate) transformStr = translateZ; // Just offset element without rotation
    //       console.log("PositionService: ",transformStr);

    elem.css({
      transform: transformStr,
      // set elements css
      '-webkit-transform': transformStr,
      '-ms-transform': transformStr,
      '-o-transform': transformStr
    });
  }

  return Position;
});
angular.module('Portfolio.Common').service('EqualDimensionsEventService', function ($rootScope) {
  // make a service so we can use dependencu injecton 
  // to easy spot what components use it 
  this.broadcast = function (side) {
    $rootScope.$broadcast('setEqualDimensions');
  }; // broadcast event


  this.listen = function (func) {
    $rootScope.$on('setEqualDimensions', func);
  }; // set listener for event

});
angular.module('Portfolio.Common').factory('GetOrientationService', function ($window) {
  return function getOrientation() {
    var scene = angular.element($window.document.querySelector('.scene')); // get ref. element for dimensions

    var sceneHeight = scene.outerHeight();
    var sceneWidth = scene.outerWidth();

    if (sceneHeight > sceneWidth) {
      // we are in portrait mode
      return 'portrait';
    }

    if (sceneWidth > sceneHeight) {
      // we are in landscape mode
      return 'landscape';
    } else return 'cube'; // dimensions are equal  

  };
});
angular.module('Portfolio.Common').factory('CleanLeftoverShimsService', function ($window, ORIENTATION_ON_LOAD, GetOrientationService) {
  // Removes shim elements that were added in previous
  // ShimTheWhiteSpaceService(..) call 
  var document = $window.document;
  var browserIsSniffed = false;
  var safariBrowser = false; // Certain safari versions first emit 'resize' event then 'orientationchange' event

  var otherBrowser = false; // Most of other browser first emit orientationchange (Chrome, FF..) then 'resize' event

  function removeShims(orientationShims) {
    var _loop = function _loop(side) {
      // we remove shims (if any were added in previous orientationChange)
      orientationShims[side] = angular.element(document.querySelector('.' + side + '-shim')); // get shim

      setTimeout(function () {
        orientationShims[side].remove();
      }, 0); // Remove shim element from page 
      // Newer chrome act like previous code                                                                           // was asynchronous, so we remove it 
      // in setTimeout(..). 
    };

    for (var side in orientationShims) {
      _loop(side);
    }
  }

  function CleanLeftoverShims() {
    var landscapeShims = {
      'top': '',
      'bottom': ''
    }; // prop names refer to sides on the cube/box

    var portraitShims = {
      'left': '',
      'right': ''
    };
    var currentOrientation = GetOrientationService(); // get orientaiton mode we are currently in

    if (!browserIsSniffed) {
      if (ORIENTATION_ON_LOAD.value === currentOrientation) // Sniff for other browsers
        otherBrowser = true; // we are in some other browser (Chrome, FF...)

      if (ORIENTATION_ON_LOAD.value !== currentOrientation) // Sniff for certain safari versions
        safariBrowser = true; // we are in safari browser

      browserIsSniffed = true;
    }

    if (otherBrowser) {
      // Chrome, FFox 
      if (currentOrientation === 'portrait') // We are actually in landscape mode, since orient.change
        removeShims(portraitShims); // happens before any 'resize' event.
      // Remove any shims that were added in portrait mode

      if (currentOrientation === 'landscape') removeShims(landscapeShims); // We are in actualy in portrait mode. Remove landscapeShims
      else return;
    }

    if (safariBrowser) {
      // Certain Safari versions (new ones)
      //                                     console.log('SAFARI: ')
      if (currentOrientation === "portrait") removeShims(landscapeShims);
      if (currentOrientation === "landscape") removeShims(portraitShims);else return;
    }
  }

  return CleanLeftoverShims;
});
angular.module('Portfolio.Common').factory('HidesAddressBarEventService', function ($window, ADDRESS_BAR_HIDDEN, CleanLeftoverShimsService) {
  // Checks if browser 
  // (usualy on mobile) hides address 
  // bar in order not to trigger EqualDimension service
  // so we don't have page size chop off in the  middle
  // of scroll.
  function hidesAddressBarFix() {
    // Puts flags that make EqualDimension(..) NOT execute when browser
    // hides address(url) bar
    var window_ = angular.element($window);
    window_.on('touchmove', function () {
      // Mark potential address bar hide on resize event, after touchmove evt
      // console.log('::touchMove event')
      ADDRESS_BAR_HIDDEN.value = true;
      ADDRESS_BAR_HIDDEN.counter = 6; // set counter number, since afther touchmove we have resize event
    });
    window_.on('orientationchange', function () {
      //console.log(' ~~ orientation-CHANGE ~~');
      ADDRESS_BAR_HIDDEN.value = true; // If there was flag set before this event, clean it

      ADDRESS_BAR_HIDDEN.counter = 6; // CleanLeftoverShimsService();
    });
  }

  return hidesAddressBarFix;
});
angular.module('Portfolio.Common').factory('NotShownPagesCleanService', function () {
  function notShownPagesClean(CURRENT_SIDE, pageName) {
    for (var name in CURRENT_SIDE.toBeShown) {
      if (name !== pageName) {
        clearTimeout(CURRENT_SIDE.toBeShown[name]);
      }
    }

    ;
  }

  return notShownPagesClean;
});
angular.module('Portfolio.Common').factory('SideWithOtherOverflowService', function () {
  return function sideWithOtherOverflow(pageName) {
    // Sides that need overflow value other then 'visible'
    // in order for vertical scroll to work (chrome mobile issue)
    return pageName !== 'quote-owlet' && pageName !== 'twiz-client' && pageName !== 'hmac-sha1' && pageName !== 'twiz-server';
  };
});
angular.module('Portfolio.Common').factory('SetSideOverflowService', function (SideWithOtherOverflowService) {
  return function (pageName) {
    var overflowSide = SideWithOtherOverflowService(pageName); // check if side needs overflow to be auto
    //  (other then visible)

    var respectOverflow;

    if (overflowSide) {
      respectOverflow = 'visible';
      return respectOverflow;
    } else {
      respectOverflow = 'auto'; // for sides that have vertical scroll issue (on chrome mobile)

      return respectOverflow;
    }
  };
});
angular.module('Portfolio.Common').factory('ShimTheWhiteSpaceService', function ($window, CleanLeftoverShimsService) {
  var document = $window.document; // convenience variable

  function shimTheWhiteSpace(verticalSides, horizontalSides, attrs) {
    //
    var side_;
    var scene = angular.element(document.querySelector('.scene'));
    var sceneWidth = scene.outerWidth();
    var sceneHeight = scene.outerHeight();
    var shim = {
      sides: '',
      // Sides of cube(box) to which we add shim elements
      position: '',
      // Position of side we currently shim
      offset: '',
      // How much shim needs to be moved to cover the white space
      element: '',
      // Holds reference to element that represents shim on page
      newCss: '',
      // How much we need to move shim in order to cover white space
      isThere: '' // Indicate if shim element is already inserted into page
      // Decide whether you're doing horizontal (top-bottom) shim or vertical(left-right)

    };

    if (sceneWidth > sceneHeight) {
      // White space is on horizontal sides
      shim.sides = horizontalSides; // We are shiming horizontal sides

      shim.offset = '-' + (sceneWidth - sceneHeight) / 2 + 'px'; // How much px we move the shim to
      // Cover the white(empty) space

      shim.newCss = {
        bottom: shim.offset,
        height: sceneWidth
      };
    } else if (sceneHeight > sceneWidth) {
      // White space is on vertical sides of                                                                           // of the cube(box)
      shim.sides = verticalSides;
      shim.offset = '-' + (sceneHeight - sceneWidth) / 2 + 'px';
      shim.newCss = {
        left: shim.offset,
        width: sceneHeight
      };
    } else return; // remove shim here also  // if equal, there is no white space so just return;


    var firstSide = shim.sides[0];
    var secondSide = shim.sides[1];
    firstSide.reg = new RegExp(firstSide.name); // regexp for selecting the right sides for shiming 

    secondSide.reg = new RegExp(secondSide.name);

    if (firstSide.reg.test(attrs["class"])) {
      side_ = angular.element(document.querySelector('.' + firstSide.name)); // set reference of first  
      // side element we shim

      shim.position = firstSide.position;
    }

    if (secondSide.reg.test(attrs["class"])) {
      side_ = angular.element(document.querySelector('.' + secondSide.name)); // set reference of second
      // element

      shim.position = secondSide.position;
    }

    if (!side_) return;
    shim.isThere = angular.element(document.querySelector('.' + shim.position + "-shim")).context;
    if (!shim.isThere) // Shim is not inserted
      side_.prepend('<div class="side-shim side ' + shim.position + '-shim"></div>'); // Add shim into page

    shim.element = angular.element(document.querySelector('.' + shim.position + '-shim')); // Select shim

    shim.element.css(shim.newCss); // set shim to cover the white space of the cube(box)
  }

  angular.element($window).on('orientationchange', function () {
    CleanLeftoverShimsService(); // remove any shim that were added previous to orientationChange event
    // Call here the ShimTheWhiteSpace_ since sfary mobile doesnt call resize event after
    // orientation-change event. Doesn't add shims as it apears now. Remove CleanLeftOverShims from
    // HidesAddresBarEventService
  });
  return shimTheWhiteSpace;
}); // pill color control

angular.module('Portfolio.Common').service('PillColorService', function ($window) {
  // sets color of the pill in navbar
  this.pillElement = angular.element($window.document.querySelector('.pill'));

  this.pillColor = function (add, remove) {
    this.pillElement.addClass(add);
    this.pillElement.removeClass(remove);
  };

  this.setColor = function (add, remove) {
    // color = 'red'  OR 'blue'
    this.pillColor(add + '-pill', remove + '-pill'); // Add blue-pill, remove red-pill class
  };

  return {
    setColor: this.setColor.bind(this)
  };
});
angular.module('Portfolio.Common').service('MakeCubeTransparentService', function ($window) {
  this.transparency = function (action) {
    // make cube transparent or opaque
    var sides = $window.document.querySelectorAll('.side'); // select cube sides

    if (!sides.forEach) {
      sides.forEach = function (func) {
        for (var i in sides) {
          func(sides[i]);
        }
      };
    }

    function sideCss(cubeSide, actionName, className) {
      // adds or removes css to cube sides
      if (_typeof(cubeSide) !== 'object') return; // older browser polyfil

      var side = angular.element(cubeSide);
      if (side.context) // only DOM elements
        side[actionName](className); // actionName = 'addClass' or 'removeClass'
    }

    sides.forEach(function (side) {
      sideCss(side, action.name, action.firstCss); // action.name = 'addClass' OR 'removeClass'
    });
    setTimeout(function (action, timing) {
      sides.forEach(function (side) {
        sideCss(side, action.name, action.secondCss); // remove or bring back 'side' elements 
      });
    }.bind(null, action), action.timing);
  };
});
angular.module('Portfolio.Common').factory('RainTextService', function ($window) {
  var firstLineElement = angular.element($window.document.querySelector('.first-line'));
  var secondLineElement = angular.element($window.document.querySelector('.second-line'));
  var firstLine = "Javascript doesn't have classes";
  var secondLine = "(even with ES6)";
  return function rainText(timeout) {
    if (!firstLineElement.text()) {
      firstLineElement.text(firstLine); // add text

      secondLineElement.text(secondLine);
    } else {
      setTimeout(function () {
        firstLineElement.text(''); // remove text

        secondLineElement.text(''); // remove text
      }, timeout);
    }
  };
});
angular.module('Portfolio.Common').factory('RainService', function ($window, MakeCubeTransparentService) {
  // makes smiley rain in canvas
  var canvas = $window.document.querySelector('.smiley-rain');
  var context2d = canvas.getContext("2d");
  var EmojiFont = new FontFace('EmojiMonochrome', 'url(client/assets/css/fonts/Emoji/EmojiSymbols-Regular.woff)');
  EmojiFont.load() // Load font before use in canvas 
  .then(function fullfiled(font) {
    $window.document.fonts.add(font);
  }, function rejected(err) {
    console.warn('Emojo MOnochrome font not loaded: \n', err);
  });
  var rainInterval; // Holds reverence to setInterval object for the rain

  function clearRain() {
    // Stops the rain in current canvas dimensions           
    context2d.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    clearInterval(rainInterval); // Stop the rain function
  }

  return function smileyRain(rain) {
    //console.log('SmileyRain');
    if (!rain) {
      clearRain();
      return;
    } // stops the rain


    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight; // getBoundigClientRect() for fractional values 

    var canvasWidth = canvas.clientWidth; // original  ['😏', '😓', '😔' ,'😞' , '😱' ,'😠' ,'😁', '😄', '😘','😨']
    // ['😓︎','😔︎','😞︎','😱︎','😁︎','😄︎','😨︎','😏︎'];  // these work on desktop browsers
    // fallback  ['☺','☹','☯','☻']; //  doesnt work on chrome mobile browser
    // stricter fallback ['☹︎', '☺︎']; doesnt work on older chrome versions (work on newer - browsertack test)
    // ['\u263A\uFE0E','\u2639\uFE0E', '\uD83D\uDE00\uFE0E'];

    var smileys = ['😓︎', '😔︎', '😞︎', '😬', '😱︎', '😁︎', '😄︎', '😕', '😨︎', '😏︎', '😑']; // these work on desktop browsers

    var smileysLength = smileys.length;
    var fontSize = 32;
    var columns = canvasWidth / fontSize;
    var drops = []; // number of colums for drops
    // x = column number, drop[x] = y coord for the smiley

    for (var x = 0; x < columns; x++) {
      drops[x] = canvasHeight + fontSize / fontSize;
    } // All smileys have initial y coord of the screen
    // to make rain fall immediately       


    var dropsLength = drops.length;

    function drawSmileyColumn() {
      context2d.fillStyle = "rgba(31, 31, 31, 0.15)"; // Make smiley leave translucent trail 

      context2d.fillRect(0, 0, canvasWidth, canvasHeight); // Add translucency accross canvas surface

      context2d.fillStyle = "#87c6ff"; // Set smiley color

      context2d.font = fontSize + "px EmojiMonochrome"; // Set font and size

      var smiley = smileys[Math.floor(Math.random() * smileysLength)]; // choose random smiley from array

      for (var i = 0; i < dropsLength; i++) {
        // go through columns
        context2d.fillText(smiley, i * fontSize, drops[i] * fontSize); // i*fontSize = 'x' coord (column)
        // drops[i]*fontSize = 'y' coord 
        // (vertical smiley position) 

        if (drops[i] * fontSize > canvasHeight && Math.random() > 0.975) drops[i] = 0; // Random return of 
        // the smiley to beginning
        // when it's off screen

        drops[i]++; // increse 'y' coord for next hit of the column (i) - makes smiley to 'fall'
      }
    }

    rainInterval = setInterval(drawSmileyColumn, 38);
  };
});
angular.module('Portfolio.Common').factory('TakeThePillService', function ($window, RainService, RainTextService, MakeCubeTransparentService, PillColorService, PILL) {
  return function takeThePill(color) {
    var timing = 2000; // css effects timing

    var props;

    if (color === 'red') {
      props = {
        color: {
          // Add blue color, remove red
          add: 'blue',
          remove: 'red'
        },
        action: {
          // Make cube transparent
          name: 'addClass',
          // jquery 
          firstCss: 'transparent-side',
          // Make sides transparent
          secondCss: 'no-display',
          // Remove sides from page flow
          timing: timing // Remove sides timing

        },
        rain: true,
        // Start smiley rain
        matrixLine: 'You stay in Wonderland and I show you how deep the rabbit hole goes.'
      };
    } else {
      // Color is blue
      props = {
        color: {
          // Add red color, remove blue 
          add: 'red',
          remove: 'blue'
        },
        action: {
          // Make cube opaque again (not transparent)
          name: 'removeClass',
          // jquery 
          firstCss: 'no-display',
          // Add sides to page flow
          secondCss: 'transparent-side',
          // Make side opaque
          timing: 0 // When to make sides visible

        },
        rain: false,
        // Stop smiley rain
        matrixLine: 'The story ends. You wake up in your bed and believe what ever you want to.'
      };
    }

    RainTextService(timing); // test chrome issue

    PillColorService.setColor(props.color.add, props.color.remove); // Set color of the pill

    MakeCubeTransparentService.transparency(props.action); // MakeCubeTransparent or opaque

    setTimeout(function () {
      RainService(props.rain);
    }, timing); // Start or stop rain (of smileys)

    PILL.color = props.color.add; // Set pill color flag

    console.log(props.matrixLine); // log matrix line on console
  };
});
angular.module('Portfolio.Common').factory('EqualDimensionsService', function (CURRENT_SIDE, ADDRESS_BAR_HIDDEN, RESIZE_EVENT, NotShownPagesCleanService, // set element's height and width 
SideWithOtherOverflowService, // to be just like window's
SetSideOverflowService) {
  // all in order for a cube/box 
  // to rotate without pages 
  // sticking out from it and each other
  function EqualDimensions(args) {
    var overflow = false;

    if (ADDRESS_BAR_HIDDEN.value && RESIZE_EVENT.value) {
      // Address bar is hiden and EqualDims(..) fired
      // on resize event
      //console.log("EqualDimensions DOESNT fire:", args.page)
      ADDRESS_BAR_HIDDEN.counter--; // decrease counter uppon each of 6 EqualDimensions(..) calls

      if (ADDRESS_BAR_HIDDEN.counter === 0) {
        ADDRESS_BAR_HIDDEN.value = false;
        overflow = false;
      }

      overflow = true; // return               // Browser hided address bar, don't chop off page;
    } // console.log('EqualDimensions fires:', args.page)


    var sceneHeight = args.scene.outerHeight() + 'px'; //  Height of the element (where 3D context is set)

    var sceneWidth = args.scene.outerWidth() + 'px'; //  Width of the scene

    var page = args.page; //  Page is the html root element for that side

    var attrs = args.attrs; //  Side is ancestor of the page element

    var pageName = attrs["class"];
    pageName = pageName.substring(0, pageName.indexOf('-wrapper')); // get page NAme

    var respectOverflow = SetSideOverflowService(pageName); // check if we need new overflow value 
    // (other then visible - chrome mobile issue)

    var dimensionsAndOverflow = {
      height: sceneHeight,
      width: sceneWidth
    };
    if (overflow && CURRENT_SIDE.value.name === pageName) dimensionsAndOverflow.overflow = respectOverflow;else dimensionsAndOverflow.overflow = 'hidden';
    page.css(dimensionsAndOverflow);

    if (CURRENT_SIDE.value.name === pageName) {
      // if we are on the side the is shown to the user
      //   console.log("SHOWN SIDE IS -> ", pageName)
      // Remove any side not picked, from sides to be shown
      NotShownPagesCleanService(CURRENT_SIDE, pageName);
      CURRENT_SIDE.toBeShown[pageName] = setTimeout(function removeEqualDimensions() {
        // Return dimensions
        // after one sec to whatever page height
        var overflowSide = SideWithOtherOverflowService(pageName); // Check if we need overflow auto

        page.css({
          height: overflowSide ? 'initial' : sceneHeight,
          // sceneHeight we need for top and bottom
          // page (scroll bug on chrome mobile)
          width: 'initial',
          overflow: overflowSide ? 'visible' : 'auto' // was 'visible' check this on any cross 
          // browser issues with vertical scroll on top and bottom pages

        });
      }, 1000); // 1s is the time the cube rotates to any side
    }
  }

  ;
  return EqualDimensions;
});
angular.module('Portfolio.Common').service('SetNavbarEventService', function ($rootScope) {
  // make a service so we can use dependencu injecton 
  // to easy spot what components use it 
  this.broadcast = function (side) {
    $rootScope.$broadcast('setNavbar');
  }; // broadcast event


  this.listen = function (func) {
    $rootScope.$on('setNavbar', func);
  }; // set listener for event

});
angular.module('Portfolio.Common').factory('SetNavbarService', function (NAVBAR_POSITION, GetNavbarCssClass) {
  // select screen-edge, nav, add classes for switching positions
  // if navabr is shown move it out of the screen, if navbar is not shown place it on screen 
  function setNavbarService() {
    // Shows/Hides navbar. Is set to fire on click event(see SetNavbar directive)
    var navbar = angular.element(document.querySelector('.navbar')); // the real navbar

    var screenEdge = angular.element(document.querySelector('.screen-edge')); // abstraction of screen edge

    var nav = angular.element(document.querySelector('.nav')); // abstraction of navbar 
    //  let window_    = angular.element(window);

    var vertical = navbar.outerHeight() > 100 ? true : false; // check how navbar is positioned

    var horizontalHide = GetNavbarCssClass(); // get css class for this screen width

    if (NAVBAR_POSITION.shown) {
      if (vertical) {
        navbar.addClass('navbar-vertical-hide');
        screenEdge.addClass('screen-edge-vertical-hide');
        nav.addClass('nav-vertical-hide');
      } else {
        // it is in horisontal position 
        navbar.addClass('navbar-' + horizontalHide);
        screenEdge.addClass('screen-edge-horizontal-hide');
        nav.addClass('nav-horizontal-hide');
      }
    } else {
      // Not shown on page
      if (vertical) {
        // Had vertical position
        navbar.removeClass('navbar-vertical-hide'); // shows navbar

        screenEdge.removeClass('screen-edge-vertical-hide'); // repositions screen edge abstraction

        nav.removeClass('nav-vertical-hide'); // reposition navbar abstraction 
      } else {
        navbar.removeClass('navbar-' + horizontalHide);
        screenEdge.removeClass('screen-edge-horizontal-hide'); // repositions screen adge abstraction

        nav.removeClass('nav-horizontal-hide');
      }
    }

    NAVBAR_POSITION.shown = NAVBAR_POSITION.shown ? false : true; // toggle shown flag   
  }

  return setNavbarService;
});
angular.module('Portfolio.Common').factory('GetNavbarCssClass', function ($window) {
  // shiff screen size then gets apropriate css class
  function getNavbarCssClass(remove) {
    var windowWidth = angular.element($window).outerWidth(); // get screen width

    var navbarClasses = ['horizontal-hide', 'horizontal-hide2', 'horizontal-hide3'];
    var class_;
    if (windowWidth > 440) class_ = navbarClasses[0]; // name of css class we want to add/remove when 
    // screen > 440

    if (windowWidth >= 321 && windowWidth <= 440) class_ = navbarClasses[1];
    if (windowWidth < 366) class_ = navbarClasses[2];

    if (remove) {
      navbarClasses.splice(navbarClasses.indexOf(class_), 1); // remove class that we planed for a screen size

      return navbarClasses; // return classes that are NOT planed for a 
      // screen size
    }

    return class_;
  }

  return getNavbarCssClass;
});
angular.module('Portfolio.Common').factory('RemoveNavbarCssClass', function (GetNavbarCssClass, NAVBAR_POSITION, $window) {
  // Controls hide & show
  // of the navbar
  function removeNavbarCssClass() {
    // is set on resize event (see setnavbar directive)
    var navbar = angular.element(document.querySelector('.navbar'));
    var vertical = angular.element($window).outerWidth() >= 1024 ? true : false; // make a service

    if (vertical) {
      navbar.removeClass('navbar-horizontal-hide navbar-horizontal-hide2 navbar-horizontal-hide3');

      if (!NAVBAR_POSITION.shown) {
        navbar.addClass('navbar-vertical-hide'); // when switched to vertical 
      } // from hidden horizontal, 

    } // add vertical-hide
    else navbar.removeClass('navbar-vertical-hide'); // if horizontal, remove vertical class artefact


    if (angular.element($window).outerWidth() >= 1024) return; // do the rest only when screen width < 1024

    if (NAVBAR_POSITION.shown) return; // only when navbar is hidden do the rest

    var remove = GetNavbarCssClass(true);
    var add = GetNavbarCssClass();
    var len = remove.length;
    navbar.addClass('navbar-' + add); // first add one that we need

    for (var i = 0; i < len; i++) {
      navbar.removeClass('navbar-' + remove[i]);
    }
  }

  return removeNavbarCssClass;
});
angular.module('Portfolio.Common').factory('SelectNavbarOptionService', function (CURRENT_SIDE) {
  return function selectNavbarOption(sides) {
    if (CURRENT_SIDE.previous_position === CURRENT_SIDE.current_position) return; // same option is clicked 

    var prevSelected;

    for (var i in sides) {
      var _side = sides[i];

      if (_side.position === CURRENT_SIDE.previous_position) {
        prevSelected = angular.element(document.querySelector('.nav-' + _side.name));
        prevSelected.removeClass('selected'); // unselect previously selected navbar option
      }
    }

    var side = CURRENT_SIDE.value;
    var newSelected = angular.element(document.querySelector('.nav-' + side.name)); // currentSide
    // becomes newSelected
    //      newSelected.selected = true;                   // mark it as selected

    newSelected.addClass('selected'); // add animation to selected navbar option
  };
});
angular.module('Portfolio.Common').filter('shorten', function () {
  return function (input, smallScreen) {
    if (smallScreen === false) return input;

    switch (input) {
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
  };
}).filter('abbreviate', function () {
  // put filter first (before controller)
  return function (input) {
    switch (input) {
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
  };
}).controller('MainCtrl', function ($scope, CURRENT_SIDE, NAVBAR_POSITION, RESIZE_EVENT, ORIENTATION_ON_LOAD, PILL, ShortenOnSmallScreensService, HidesAddressBarEventService, RotateCubeEventService, EqualDimensionsEventService, GetOrientationService, SetNavbarEventService, SelectNavbarOptionService, ShowProjectService, TakeThePillService) {
  var main = this;
  main.sides = [{
    tittle: "",
    name: 'home',
    // front side
    position: 'front',
    rotateSide: "rotateY(0deg)",
    rotateCube: "rotateY(0deg)",
    url: 'client/src/portfolio/Home/tmpl/home.html',
    selected: ''
  }, {
    name: "cv",
    // "back" or the cirriculum vitae
    tittle: "",
    position: 'back',
    rotateSide: 'rotateY(180deg)',
    rotateCube: 'rotateY(-180deg)',
    url: 'client/src/portfolio/Cv/tmpl/cv.html',
    selected: ''
  }, {
    name: "quote-owlet",
    // "bottom"
    tittle: "",
    position: 'bottom',
    rotateSide: 'rotateX(-90deg)',
    rotateCube: 'rotateX(90deg)',
    url: 'client/src/portfolio/QuoteOwlet/tmpl/quote-owlet.html',
    selected: '',
    info: {
      desc: 'Random quote machine. Integrates Twiz in order to interact with X.',
      tech: 'Vanilla JS.',
      github: 'https://github.com/gits2501/QuoteOwlet'
    }
  }, {
    name: "hmac-sha1",
    // "right"
    tittle: "",
    position: 'right',
    rotateSide: "rotateY(90deg)",
    rotateCube: 'rotateY(-90deg)',
    url: 'client/src/portfolio/HmacSha1/tmpl/hmac-sha1.html',
    selected: '',
    info: {
      desc: "Form of a digital signature. Can produce hash string that is used to provide data integrity and authentication.",
      tech: " Vanilla JS, NPM, Node, Crypto, Tap. ",
      github: "https://github.com/gits2501/Hmac_Sha1"
    }
  }, {
    name: "twiz-client",
    // "top"
    tittle: "",
    position: 'top',
    rotateSide: 'rotateX(90deg)',
    rotateCube: 'rotateX(-90deg)',
    url: 'client/src/portfolio/TwizClient/tmpl/twiz-client.html',
    selected: '',
    info: {
      desc: 'Browser part of X\'s authentication and authorization algorithm (OAuth 1.0a).',
      tech: 'Vanilla JS, Browserify, NPM, Istanbul, Mocha, Coveralls, Mocha-Headless-Chrome, Eslint.',
      github: 'https://github.com/gits2501/twiz-client'
    }
  }, {
    name: "twiz-server",
    // "left"
    tittle: "",
    position: 'left',
    rotateSide: "rotateY(-90deg)",
    // Initail rotation this side has when cube/box forms
    rotateCube: 'rotateY(90deg)',
    // Rotation that cube element needs to have in order to show this side
    url: 'client/src/portfolio/TwizServer/tmpl/twiz-server.html',
    selected: '',
    info: {
      desc: 'Server part of X\'s authentication and authorization algorithm (OAuth 1.0a).',
      tech: 'Node, Express, NPM, Nyc, Mocha, Nock, Node-Mocks-Http, Coveralls, Eslint.',
      github: 'https://github.com/gits2501/twiz-server'
    }
  }];
  CURRENT_SIDE.value = main.sides[0]; // home side is initialy shown

  main.rotateCube = function (side) {
    // rotates cube/box do show a side of it
    RotateCubeEventService.broadcast(side); // rotate cube/box to side we want (we clicked)

    this.setCurrentSide(side); // set side that is currently shown
    //    console.log('CURRENT_SIDE', CURRENT_SIDE)

    this.setEqualDimensions(); // Set dimension to equal those of the window/tab
    //  this.hideTopAndBottom();                 // Hides top and bottom sides when when other sides are shown

    this.selectNavbarOption(this.sides); // Handles css animation for selected (clicked) navbar option
  };

  main.setEqualDimensions = function () {
    //console.log('main.setEqualDimensions')
    RESIZE_EVENT.value = false; // mark that EqualDim(..) was not called on resize event

    EqualDimensionsEventService.broadcast(); // brodcast event for setting height and width to all sides
  };

  setTimeout(function () {
    main.setEqualDimensions();
  }, 500);

  main.setCurrentSide = function (side) {
    // mark which side is currently shown
    CURRENT_SIDE.value = side; // ref to the side object

    CURRENT_SIDE.previous_position = CURRENT_SIDE.current_position || ''; // remember previous position

    CURRENT_SIDE.current_position = side.position; // set current position 
  };

  main.hideTopAndBottom = function () {
    // 
    HideTopAndBottomEventService.broadcast();
  };

  NAVBAR_POSITION.shown = true; // initialy is rendered as shown on page

  main.setNavbar = function () {
    SetNavbarEventService.broadcast();
  };

  main.selectNavbarOption = function () {
    // makes css animation on selected navbar option
    SelectNavbarOptionService(this.sides);
  };

  main.hmacAndTwizServ = function (include) {
    //  filter two related projects
    return function (side) {
      if (include) return side.name === 'hmac-sha1' || side.name === "twiz-server"; // include both

      return side.name === 'quote-owlet' || side.name === 'twiz-client'; // anything else then those 2
    };
  };

  main.pickedProject;
  main.previousPickedOnLine; // previously clicked text near horizontal line

  main.pickProject = function (side) {
    //console.log("pickedProject: ", side)
    ShowProjectService(side, this, $scope);
  };

  main.projectsOnly = function () {
    return function (side) {
      if (side.name !== 'cv' && side.name !== 'home') return true;
    };
  };

  main.setOrientationOnLoad = function () {
    // Get orientation mode (portrait/landscape)
    ORIENTATION_ON_LOAD.value = GetOrientationService();
  };

  main.setOrientationOnLoad(); // Get it when controller compiles

  var saved = TakeThePillService; // remember reference

  var debounce = function debounce() {
    // return back TakeThePillService ability
    if (TakeThePillService === debounce) TakeThePillService = saved;
  };

  main.takeThePill = function () {
    // Do smiley rain animation, change pill color
    TakeThePillService(PILL.color);
    TakeThePillService = debounce; // remove TakeThePillService - so nothing happens in immediate call

    setTimeout(debounce.bind(null), 2000); // afther interval bring back TakeThePillService
  };

  HidesAddressBarEventService(); // (dont chop off page)  
}).value('CURRENT_SIDE', {
  value: '',
  toBeShown: {}
}) // descibes currently shown side of the cube/box
.value('NAVBAR_POSITION', {
  shown: ''
}).value('ADDRESS_BAR_HIDDEN', {
  value: '',
  counter: 6
}).value('RESIZE_EVENT', {
  value: ''
}).value('ORIENTATION_ON_LOAD', {
  value: ''
}).value('PILL', {
  color: 'red'
}); // initialy user is offered with red pill 

angular.module('Portfolio.Common').directive('positionside', function (PositionService, $window) {
  //    console.log('positionSide directive')
  var linker = function linker(scope, elem, attrs, ctrl) {
    //  console.log('scope:', scope) 
    var domArgs = {
      'side': scope.side,
      // reference of the side from ng-repeat 
      'elem': elem,
      // jquery wrapper on dom object
      'scene': angular.element(document.querySelector('.scene'))
    };
    var cssArgs = {
      rotateSide: true,
      // We re position side
      rotate: 'first' // first we are going to rotate side element

    };
    var PositionSide = PositionService.bind(null, domArgs, cssArgs); // Position side in order to form
    // box/cube

    if (attrs["class"].indexOf(scope.side.name) !== -1) PositionSide(); // position side when directive is added 

    angular.element($window).on('resize', PositionSide); // Do the same when window size changes

    scope.$on('$destroy', function () {
      angular.element($window).off('resize', PositionSide); // When scope dies prevent leaks    
    });
  };

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('positioncube', function ($window, CURRENT_SIDE, PositionService) {
  var linker = function linker(scope, elem, attrs) {
    // get reference to currently shown side 
    var domArgs = {
      'side': '',
      'elem': elem,
      // Cube element
      'scene': angular.element(document.querySelector('.scene')) // Element with 3d contect set

    };
    var cssArgs = {
      sign: '-',
      // Sign for z-axis offset we use to position cube
      rotateCube: true,
      // We are positioning cube element
      rotate: 'last' // Add rotation information last 

    };

    function PositionCube() {
      domArgs.side = CURRENT_SIDE.value; // To correctly position in reference to currently shown side
      //console.log('positionCube - CURRENT_SIDE.value.position', CURRENT_SIDE.value.position)

      PositionService(domArgs, cssArgs);
    }

    PositionCube();
    var window_ = angular.element($window);
    window_.on('resize', PositionCube); // Reposition cube on any window size change, to keep
    // page look clean and not fuzzy.

    scope.$on('destroy', function () {
      window_.off('resize', PositionCube); // When scope is gone remove listener to prevent mem.
      // leaks.
    });
  };

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('rotatecube', function (RotateCubeEventService, PositionService) {
  var linker = function linker(scope, elem, attrs) {
    var cube = elem; //              console.log('rotateCube directive')

    var domArgs = {
      'side': '',
      'elem': elem,
      // cube element
      'scene': angular.element(document.querySelector('.scene')) // element with 3d context set

    };
    var cssArgs = {
      sign: '-',
      // Sign of traslateZ css parametar
      rotateCube: true,
      // Rotating cube element
      rotate: 'last' // Add rotation css string last 

    };

    function RotateCube() {
      //    console.log('cubeRotated@@');
      domArgs.side = arguments[1]; // side is passed as second argument to listener

      PositionService(domArgs, cssArgs); // Rotate the cube 
    }

    RotateCubeEventService.listen(RotateCube);
  };

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('equalDimensions', function ($window, EqualDimensionsService, EqualDimensionsEventService, RESIZE_EVENT) {
  var linker = function linker(scope, elem, attrs, ctrl) {
    //  console.log('equalDimensions DIRECTIVE')
    var scene = angular.element(document.querySelector('.scene')); // console.log('sceneHeight', scene.outerHeight());

    function EqualDimensions() {
      // on broadcasted event set page dimensions 
      EqualDimensionsService({
        page: elem,
        attrs: attrs,
        scene: scene
      });
    }

    EqualDimensionsEventService.listen(EqualDimensions); // Set listener for any broadcast events

    function EqualDimensionsOnResize() {
      // console.log('EqualDimensions on RESIZE_EVENT')
      RESIZE_EVENT.value = true; // Mark that EqualDims was called on resize evt

      EqualDimensions();
    }

    angular.element($window).on('resize', EqualDimensionsOnResize); // Do the same when window size changes

    scope.$on('$destroy', function () {
      angular.element($window).off('resize', EqualDimensionsOnResize); // When scope dies prevent leaks    
    });
  };

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('setNavbar', function (SetNavbarEventService, SetNavbarService, RemoveNavbarCssClass, $window) {
  var linker = function linker(scope, elem, attrs) {
    SetNavbarEventService.listen(function () {
      SetNavbarService();
    });
    var window_ = angular.element($window);
    window_.on('resize', RemoveNavbarCssClass);
    scope.$on('destroy', function () {
      window_.off('resize', RemoveNavbarCssClass);
    });
  };

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('shimControll', function ($window, ShimTheWhiteSpaceService) {
  function linker(scope, elem, attrs) {
    var horizontalSides = [{
      name: 'twiz-client',
      position: 'top'
    }, {
      name: 'quote-owlet',
      position: 'bottom'
    }]; // Top and Bottom sides

    var verticalSides = [// Left and Right sides
    {
      name: 'twiz-server',
      position: 'left'
    }, {
      name: 'hmac-sha1',
      position: 'right'
    }];
    setTimeout(function () {
      ShimTheWhiteSpaceService(verticalSides, horizontalSides, attrs);
    }, 0); // Call asap

    var shimTheWhiteSpace_ = ShimTheWhiteSpaceService.bind(null, verticalSides, horizontalSides, attrs);
    var window_ = angular.element($window);
    window_.on('resize', shimTheWhiteSpace_); // Deal with white space on every resize event also

    scope.$on('destroy', function () {
      window_.off('resize', shimTheWhiteSpace_); // When scope is gone remove listener to prevent mem.
      // leaks.
    });
  }

  return {
    restrict: 'A',
    link: linker
  };
});
angular.module('Portfolio.Common').directive('resizeRain', function ($window, PILL, RainService) {
  function linker() {
    var window_ = angular.element($window);
    window_.on('resize', function () {
      if (PILL.color === 'blue') {
        RainService(false); // stop rain

        RainService(true); // rain again
      }
    });
  }

  return {
    restrinct: 'A',
    link: linker
  };
});
angular.module('Portfolio.QuoteOwlet', ['Portfolio.Common']);
angular.module('Portfolio.QuoteOwlet').service('AnimationService', function () {
  var animation = this;

  animation.preQuote = function (num) {
    // adds css class to a given quote elements specified with 'num'
    this[num] = {};
    this[num].quote = angular.element(document.querySelector('#_' + num)); // Get quote element

    this[num].text = angular.element(document.querySelector('#_' + num + " .text")); // Text of quote in 'num'

    this[num].author = angular.element(document.querySelector('#_' + num + " .author")); // Author of quote ..
    // console.log('quote Animation ::: ', quote);
    // add on click animations

    this[num].quote.addClass('quote-on-click');
    this[num].text.addClass('text-on-click');
    this[num].author.addClass('author-on-click');
  };

  animation.postQuote = function (num) {
    this[num].quote.removeClass('quote-on-click');
    this[num].text.removeClass('text-on-click');
    this[num].author.removeClass('author-on-click');
  };
});
angular.module('Portfolio.QuoteOwlet').factory('FormEncodeService', function ($window) {
  function formEncode(dataObj, spaces) {
    var pairs = [];
    var value;
    var key;
    var type;

    for (var name in dataObj) {
      type = _typeof(dataObj[name]);

      if (dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null") {
        // only props 
        // in dataObj 
        var _encodeURIComponent = $window.encodeURIComponent;
        key = _encodeURIComponent(name); // encode property name

        if (type === 'object') {
          value = formEncode(dataObj[name], spaces); // form encode object

          value = _encodeURIComponent(value); // since return value is string, uri encode it
        } else value = _encodeURIComponent(dataObj[name]); // property is not object, just uri encode it


        if (!spaces) {
          key = key.replace(/%20/g, "+");
          value = value.replace(/%20/g, "+"); // substitute space encoding for +
        }

        pairs.push(key + "=" + value);
      }
    }

    return pairs.join("&");
  }

  return formEncode;
});
angular.module('Portfolio.QuoteOwlet').service('UtilsService', function () {
  var utils = this;

  utils.parseQuote = function (response) {
    // Parses quote text and quote author from string 
    if (response.data.length !== 0) {
      var q = response.data; // Take string that server has sent
      // Server response is in text format like bellow:
      // This is the quote string. (Here goes the author)  

      var quoteEnd = q.indexOf("(") === -1 ? q.length : q.indexOf("(") - 1; // Get index of the "(" - 1. 
      // Emty space before "(" .

      var quoteText = q.substring(0, quoteEnd); // Get quote string up to dot(including).

      var authorEnd = q.indexOf(")");
      var quoteAuthor = "";
      if (authorEnd !== -1) quoteAuthor = q.substring(quoteEnd + 2, authorEnd); // Get author string, 
      // up to ")" . If there is one.
    } else {
      console.log('There is no quote string from server ...');
      return;
    }

    return {
      'text': quoteText,
      'author': quoteAuthor
    }; // return quote text and quote author
  };
});
angular.module('Portfolio.QuoteOwlet').service('ConfigureRequestService', function (FormEncodeService) {
  // sets config object used to fetch a quote
  // from server
  var crs = this;
  crs.config = {
    method: "GET",
    url: ""
  };

  crs.setUrl = function () {
    this.url = 'https://quoteowlet.herokuapp.com/fetch/https://api.forismatic.com/api/1.0/'; // Server address
    // with endpoint.
    // (is proxy serv)

    this.queryParams = {
      // making params object specific to server endpoint we are connnecting to. 
      method: 'getQuote',
      format: 'text',
      key: 0,
      lang: 'en'
    };

    this.setQuoteKey = function () {
      // sets random quote key that server is using to generates data.
      var value = Math.round(Math.random() * 100000);
      this.queryParams.key = value;
    };

    this.setQueryString = function () {
      this.queryString = FormEncodeService(this.queryParams); // Service uses form-url-encoded scheme to return
      //  query string

      if (this.url.indexOf("?") === -1) this.url += "?"; // if doesnt have query delimiter add it. 

      this.url += this.queryString; // Adds query string to url 
    };

    this.setQuoteKey(); // set random quote number

    this.setQueryString(); // add query string to url

    this.config.url = this.url; // set config url
  };

  crs.init = function () {
    crs.setUrl();
    return crs.config;
  }; // return config object for a request; 

});
angular.module('Portfolio.QuoteOwlet').factory('GetQuoteModel', function ($http, ConfigureRequestService, UtilsService) {
  function getQuote() {
    return $http(ConfigureRequestService.init()).then(function success(data) {
      return UtilsService.parseQuote(data);
    }, function failure(err) {
      console.log('error --> :', err);
    });
  }

  return getQuote;
});
angular.module('Portfolio.QuoteOwlet').controller('QuoteOwletCtrl', function ($scope, GetQuoteModel, AnimationService) {
  // GetQuote MODEl
  var owletCtrl = this;
  owletCtrl.quotes = {
    '1': {
      text: "Setting an example is not the main means of influencing another, it is the only means.",
      author: 'Albert Einstein'
    },
    '2': {
      text: 'What lies behind us and what lies before us are small matters compared to what lies within us. ',
      author: 'Oliver Holmes'
    },
    '3': {
      text: 'I am always doing that which I cannot do, in order that I may learn how to do it.',
      author: 'Pablo Picaso'
    },
    '4': {
      text: 'When I let go of what I am, I become what I might be. ',
      author: 'Lao Tzu'
    }
  };

  owletCtrl.updateQuote = function (num) {
    GetQuoteModel().then(function (quote) {
      setTimeout(function () {
        // delay model update while post quote animation lasts
        $scope.$apply(function () {
          AnimationService.postQuote(num); // css animation after we get quote data

          this.quotes[num].text = quote.text;
          this.quotes[num].author = quote.author;
        }.bind(owletCtrl));
      }, 400);
    }.bind(this), function (err) {
      console.log('GetQuoteModel error: ', err);
    });
    AnimationService.preQuote(num); // css animation before we get quote data
  };
});
angular.module('Portfolio.HmacSha1', ['Portfolio.Common']);
angular.module('Portfolio.HmacSha1').factory('CreateHashStringService', function () {
  return function createHashString() {
    var alphaNums = '5ab1cd4e2f0g3h7ij4kl6mn2o8pqr9stu0vwxy1z';
    var length = alphaNums.length - 1;
    var hash = '';
    var k; // index

    for (var i = 0; i < 27; i++) {
      k = Math.round(Math.random() * length); // Make index number random, goes up to aplhanum.length

      hash += alphaNums[k]; // Take char from k-th place in alphaNums and put in hash
    }

    return hash;
  };
});
angular.module('Portfolio.HmacSha1').factory('HideNumbersService', function () {
  return function hideNumbers() {
    var hashNums = document.querySelectorAll('.hash-num');
    var len = hashNums.length;
    if (len === 0) return;

    for (var i = 0; i < len; i++) {
      var num = angular.element(hashNums[i]);
      num.addClass('hash-num-hide');
    }
  };
});
angular.module('Portfolio.HmacSha1').factory('AnimateApstractionService', function () {
  // get all 3 dotted border elements
  // add css classes 
  var rows = [];
  rows.push(angular.element('#r1'));
  rows.push(angular.element('#r2'));
  rows.push(angular.element('#r3'));

  function jqClass(action) {
    // uses jquery addClass or removeClass
    var command = action + 'Class'; // make jquery function name

    for (var i in rows) {
      var k = Number(i);
      rows[i][command]('border-color-' + ++k); // adds or removes css class
    }
  }

  return function animateApstraction() {
    jqClass('add');
    var interval = 700;
    setTimeout(function () {
      jqClass('remove');
    }, interval += 120);
  };
});
angular.module('Portfolio.HmacSha1').factory('AnimateHashNumbersService', function ($window, CreateHashStringService) {
  // take element that will contain numbers 
  // produce hash string of 40 chars
  // add numbers one by one to container
  // add css classes to numbers
  return function animateHashNumbers() {
    var windowSize = angular.element($window).innerWidth();
    var hash_El = angular.element(document.querySelector('.hash')); // get reference of container

    var hash = CreateHashStringService(); // generate hash numbers

    hash_El.empty(); // remove eny previous hash numbers

    var interval = 0; // 

    var _loop2 = function _loop2(i) {
      hash_El.append('<span class="hash-num" id="h_' + i + '">' + hash[i] + '</span>'); // append a number

      var span = angular.element(document.querySelector('#h_' + i));
      setTimeout(function () {
        span.addClass('drop-number');
      }, interval += 60); // every 60 ms drop a number
    };

    for (var i in hash) {
      _loop2(i);
    }
  };
});
angular.module('Portfolio.HmacSha1').controller('HmacSha1Controller', function (AnimateHashNumbersService, AnimateApstractionService, HideNumbersService) {
  var hs1Ctrl = this;

  hs1Ctrl.animateHashNumbers = function () {
    AnimateApstractionService();
    setTimeout(function () {
      HideNumbersService();
    }, 460);
    setTimeout(function () {
      AnimateHashNumbersService();
    }, 750);
  };
});
angular.module('Portfolio.TwizClient', ['Portfolio.Common']);
angular.module('Portfolio.TwizClient').factory('StartAnimationService', function ($window) {
  // animates twiz client or server start , to indicate 
  // to the  user where to click for full animation display
  function addAndRemoveCss(element, className, delay) {
    // add class and remove it in deley ms
    element.addClass(className);
    setTimeout(function () {
      element.removeClass(className);
    }, delay);
  }

  function animateStart(elementClassName, animationClassName) {
    // Animate twiz client or server start 
    var start = angular.element($window.document.querySelector(elementClassName));
    addAndRemoveCss(start, animationClassName, 700);
  }

  function animateStartWithTimeout(elementClassName, animationClassName, timeout) {
    setTimeout(animateStart.bind(null, elementClassName, animationClassName), timeout);
  }

  var twiz_server_done = false; // flags used to run start animations only once (after initial run)

  var twiz_client_done = false;
  return function startAnimation(side_name) {
    if (side_name === 'twiz-client') {
      if (twiz_client_done) return;
      animateStartWithTimeout('.twiz-start', 'twiz-start-color', 1200);
      twiz_client_done = true;
    } else if (side_name === 'twiz-server') {
      if (twiz_server_done) return;
      animateStartWithTimeout('.twiz-server .twiz-start', 'start-grey', 1200);
      twiz_server_done = true;
    }
  };
});
angular.module('Portfolio.TwizClient').factory('GetCirclesService', function ($window) {
  // Gets elements that represent circles on page, also set class
  // names to be added to those elements
  return function getCircles() {
    var circles = []; // placeholder for green and blue elements (mosty circles on page)  
    // Add to blue and green in format [element, className]

    circles.push([angular.element($window.document.querySelector('.twiz-start')), 'twiz-start-color']);
    circles.push([angular.element($window.document.querySelector('.col-right #out_1')), 'outer-blue']);
    circles.push([angular.element($window.document.querySelector('.col-left #out_2')), 'outer-green']); // to outer 2 and 21  we add classes at same time also

    var bothBlue = {
      first: [angular.element($window.document.querySelector('.col-right #out_2')), 'outer-blue'],
      second: [angular.element($window.document.querySelector('.col-right #out_21')), 'outer-blue']
    };
    circles.push(bothBlue); // to outer 3 and 31 we add clasess at same time (check loop below)

    var bothGreen = {
      first: [angular.element($window.document.querySelector('.col-left #out_3')), 'outer-green'],
      second: [angular.element($window.document.querySelector('.col-left #out_31')), 'outer-green']
    };
    circles.push(bothGreen);
    circles.push([angular.element($window.document.querySelector('.col-right #out_3')), 'outer-blue']);
    circles.push([angular.element($window.document.querySelector('.col-middle #out_4')), 'col-middle outer-grey']);
    circles.push([angular.element($window.document.querySelector('.col-right #out_4')), 'outer-blue']);
    return circles;
  };
});
angular.module('Portfolio.TwizClient').factory('AnimateTwizClientService', function ($window, GetCirclesService, CURRENT_SIDE) {
  var timeouts = [];
  var circles;

  function cancelTimeouts(timeouts) {
    var len = timeouts.length;

    for (var i = 0; i < len; i++) {
      $window.clearTimeout(timeouts[i]);
    }
  }

  var twc_circles = GetCirclesService(); // Get elements that repesent circles and class names to be added 

  var twc_timeouts = [];
  return function animateTwizClient(tws_circles, tws_timeouts) {
    var side = CURRENT_SIDE.value.name;

    if (side === 'twiz-server') {
      timeouts = tws_timeouts;
      if (timeouts.length) cancelTimeouts(tws_timeouts); // Cancel any previous twiz-server animation

      circles = tws_circles; // Use twiz-server circles
    }

    if (side === 'twiz-client') {
      timeouts = twc_timeouts;
      if (timeouts.length) cancelTimeouts(timeouts); // Cancel any previous twiz-client animation

      circles = twc_circles; // Use twiz-client circles for animation
    }

    var timeStart = 0;

    function addClassTimeout(element, className, addTime, removeTime) {
      var removeTimeNegative;

      if (removeTime + removeTime < 0) {
        // check if removeTime is negative
        removeTimeNegative = true;
        timeStart += removeTime; // timeStart is returned at same numbers like last one
      }

      var timeout_ = setTimeout(function () {
        // add class
        element.addClass(className);
      }, addTime ? timeStart += addTime : timeStart);
      timeouts.push(timeout_); // we push only timeouts that add classes

      if (removeTimeNegative) removeTime = -1 * removeTime; // Make it positive to set same offset for
      // class removal like in other calls

      setTimeout(function () {
        // remove class
        element.removeClass(className);
      }, timeStart += removeTime);
    }

    var len = circles.length; //  longest array length     

    for (var i = 0; i < len; i++) {
      var circle = circles[i];

      if (circle.first) {
        addClassTimeout(circle.first[0], circle.first[1], 400, 700);
        addClassTimeout(circle.second[0], circle.second[1], 0, -700); // we add 0 for same time as prevoius call
      } else addClassTimeout(circle[0], circle[1], 400, 700);
    }
  };
});
angular.module('Portfolio.TwizClient').controller('TwizClientController', function ($scope, AnimateTwizClientService, StartAnimationService, CURRENT_SIDE) {
  var twcCtrl = this;

  twcCtrl.animateTwizClient = function () {
    // Animate circles (tokens) on page that represent 
    // twiz-client process
    AnimateTwizClientService();
  };

  $scope.current_side = CURRENT_SIDE;
  $scope.$watch('current_side.value', function (newSide, oldSide) {
    StartAnimationService(newSide.name);
  });
});
angular.module('Portfolio.TwizServer', ['Portfolio.TwizClient']);
angular.module('Portfolio.TwizServer').factory('GetTwizServerCirclesService', function ($window) {
  return function getTwizServerCircles() {
    var circles = []; // placeholder for green and blue elements (mosty circles on page)  
    // Add to purple, blue and grey circles in format [element, className]

    var pref = '.twiz-server '; // selector prefix fot the circles (elements) on twiz-server page

    circles.push([angular.element($window.document.querySelector(pref + '.twiz-start')), 'start-grey']);
    circles.push([angular.element($window.document.querySelector(pref + '.col-middle #out_1')), 'outer-purple']);
    circles.push([angular.element($window.document.querySelector(pref + '.col-right #out_1')), 'outer-blue']);
    circles.push([angular.element($window.document.querySelector(pref + '.col-middle #out_2')), 'outer-purple']);
    circles.push([angular.element($window.document.querySelector(pref + '.col-right #out_2')), 'outer-blue']);
    circles.push([angular.element($window.document.querySelector(pref + '.col-left #out_3')), 'outer-grey']);
    return circles;
  };
});
angular.module('Portfolio.TwizServer').factory('AnimateTwizServerService', function (AnimateTwizClientService, GetTwizServerCirclesService) {
  var tws_circles = GetTwizServerCirclesService(); // get the circles from twiz-server page

  var tws_timeouts = [];
  return function animateTwizServer() {
    AnimateTwizClientService(tws_circles, tws_timeouts); // animation logic is same as for the twiz-client page
  };
});
angular.module('Portfolio.TwizServer').controller('TwizServerController', function (AnimateTwizServerService) {
  var twsCtrl = this;

  twsCtrl.animateTwizServer = function () {
    AnimateTwizServerService();
  };
});
var portfolio = angular.module('Portfolio', ['ngAnimate', 'ngRoute', 'ngMessages', 'Portfolio.Common', 'Portfolio.QuoteOwlet', 'Portfolio.HmacSha1', 'Portfolio.TwizClient', 'Portfolio.TwizServer']);
portfolio.config(function ($routeProvider) {
  $routeProvider.when('/', {
    // root will point to page with full page cude animation
    templateUrl: 'client/src/portfolio/Common/tmpl/main.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  });
});