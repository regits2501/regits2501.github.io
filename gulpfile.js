var gulp   = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function(){
     var base = 'client/src/portfolio/'
     return gulp.src([ 
          base + 'Common/Common.js',
          base + 'Common/services/CalculateOffsetService.js',
          base + 'Common/services/RotateCubeEventService.js', 
          base + 'Common/controllers/MainController.js',
          base + 'Common/directives/PositionSides.js',
	  base + 'Common/directives/PositionCube.js',
	  base + 'Common/directives/RotateCube.js',
           
          base + 'Portfolio.js'
     ])
     .pipe(concat('PortfolioApp.js'))
     .pipe(gulp.dest('client/assets/js')) 
})
