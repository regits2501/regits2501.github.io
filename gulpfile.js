var gulp   = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function(){
     var base = 'client/src/portfolio/'
     return gulp.src([ 
          
          base + 'Home/Home.js',
          base + 'Home/directives/GetContent.js',

          base + 'Common/Common.js',
          base + 'Common/services/CalculateOffsetService.js',
          base + 'Common/services/RotateCubeEventService.js', 
          base + 'Common/services/PositionService.js', 
          base + 'Common/services/EqualDimensionsEventService.js',
          base + 'Common/services/EqualDimensionsService.js', 

          base + 'Common/services/HideTopAndBottomEventService.js', 
          base + 'Common/services/HideTopAndBottomService.js', 

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
          base + 'Common/directives/HideTopAndBottom.js', 
          base + 'Common/directives/SetNavbar.js', 
                  
          base + 'Portfolio.js',
     ])
     .pipe(concat('PortfolioApp.js'))
     .pipe(gulp.dest('client/assets/js')) 
})
