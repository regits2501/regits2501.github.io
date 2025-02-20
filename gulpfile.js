var gulp   = require('gulp');
var concat = require('gulp-concat');
var babel  = require('gulp-babel');


gulp.task('concat-js', function(){
     var base = 'client/src/portfolio/'
     return gulp.src([ 
          
          base + 'Home/Home.js',                                         // Home
          base + 'Home/services/ShowProjectService.js',
          base + 'Home/services/ShortenOnSmallScreensService.js',
          base + 'Home/directives/GetContent.js',

          base + 'Common/Common.js',                                     // Common
          base + 'Common/services/CalculateOffsetService.js',
          base + 'Common/services/RotateCubeEventService.js', 
          base + 'Common/services/PositionService.js', 
          base + 'Common/services/EqualDimensionsEventService.js',
          base + 'Common/services/GetOrientationService.js',
          base + 'Common/services/CleanLeftoverShimsService.js',
          base + 'Common/services/HidesAddressBarEventService.js',
          base + 'Common/services/NotShownPagesCleanService.js',
          base + 'Common/services/SideWithOtherOverflowService.js',
          base + 'Common/services/SetSideOverflowService.js',
          base + 'Common/services/ShimTheWhiteSpaceService.js',
          base + 'Common/services/PillColorService.js',
          base + 'Common/services/MakeCubeTransparentService.js',
          base + 'Common/services/RainTextService.js',
          base + 'Common/services/RainService.js',
          base + 'Common/services/TakeThePillService.js',
         
          
          base + 'Common/services/EqualDimensionsService.js', 

        //  base + 'Common/services/HideTopAndBottomEventService.js',      // remove HideTopAndBottom ability
        //  base + 'Common/services/HideTopAndBottomService.js', 

          base + 'Common/services/SetNavbarEventService.js', 
          base + 'Common/services/SetNavbarService.js',
          base + 'Common/services/GetNavbarCssClass.js',
          base + 'Common/services/RemoveNavbarCssClass.js',
         
          base + 'Common/services/SelectNavbarOptionService.js',

          base + 'Common/controllers/MainController.js',
          base + 'Common/directives/PositionSides.js',
	  base + 'Common/directives/PositionCube.js',
	  base + 'Common/directives/RotateCube.js',
	  base + 'Common/directives/EqualDimensions.js',
      //  base + 'Common/directives/HideTopAndBottom.js', 
          base + 'Common/directives/SetNavbar.js', 
          base + 'Common/directives/ShimControll.js', 
          base + 'Common/directives/ResizeRain.js', 
   
          base + 'QuoteOwlet/QuoteOwlet.js',                             // QuoteOwlet
          base + 'QuoteOwlet/services/AnimationService.js',
          base + 'QuoteOwlet/services/FormEncodeService.js',
          base + 'QuoteOwlet/services/UtilsService.js',
          base + 'QuoteOwlet/services/ConfigureRequestService.js',
          base + 'QuoteOwlet/models/GetQuoteModel.js',

          base + 'QuoteOwlet/controllers/QuoteOwletController.js',

          base + 'HmacSha1/HmacSha1.js',
          base + 'HmacSha1/services/CreateHashStringService.js',
          base + 'HmacSha1/services/HideNumbersService.js',
          base + 'HmacSha1/services/AnimateApstractionService.js',
          base + 'HmacSha1/services/AnimateHashNumbersService.js',

          base + 'HmacSha1/controllers/HmacSha1Controller.js',  
         
          base + 'TwizClient/TwizClient.js',                             // Twiz-Client
          base + 'TwizClient/services/StartAnimationService.js',
          base + 'TwizClient/services/GetCirclesService.js',
          base + 'TwizClient/services/AnimateTwizClientService.js',
          base + 'TwizClient/controllers/TwizClientController.js',
                          
          base + 'TwizServer/TwizServer.js',                            // Twiz-Server
          base + 'TwizServer/services/GetTwizServerCirclesService.js',
          base + 'TwizServer/services/AnimateTwizServerService.js',
          base + 'TwizServer/controllers/TwizServerController.js',
          
 
 
          base + 'Portfolio.js'
     ])
     .pipe(concat('PortfolioApp.js'))
     .pipe(babel())                                                     // transpile
     .pipe(gulp.dest('client/assets/js')) 
})


let distCSSFolder = 'client/assets/css';

gulp.task('concat-css1', function(){
     var base = 'client/src/portfolio/css/';
     
     return gulp.src([

           base + 'normalize.css',
           base + 'styles.css',
           base + 'home.css',
           base + 'cv.css'
     ])
     .pipe(concat('cube-part1.css'))
     .pipe(gulp.dest(distCSSFolder))
})


gulp.task('concat-css2', function(){
     var base = 'client/src/portfolio/css/';
     
     return gulp.src([

           base + 'quote-owlet.css', 
           base + 'hmac-sha1.css', 
           base + 'twiz-client.css',
           base + 'twiz-server.css',
           base + 'reset.css', 
     ])
     .pipe(concat('cube-part2.css'))
     .pipe(gulp.dest(distCSSFolder))
})

gulp.task('watch-build', function() {
 
  // watch for js files then run 'build' task
  gulp.watch('client/src/portfolio/**/*.js',  gulp.series('concat-js'));

  // watch for .css files then run 'build' task
  gulp.watch('client/src/portfolio/css/**/*.css', gulp.series('concat-css1', 'concat-css2'));
});





