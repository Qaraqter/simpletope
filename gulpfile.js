var gulp = require('gulp'),
    less = require('gulp-less');

// gulp.task('less', function() {
//     gulp
//         .src('./source/less/app.less')
//     .pipe(plumber(function(error) {
//         gutil.log(gutil.colors.red(error.message));
//         gutil.beep();
//         this.emit('end');
//     }))
//     .pipe(less())
//     .pipe(prefixer('last 2 versions', 'ie 9'))
//     .pipe(gulp.dest('./css'));
// });
//
// gulp.task('less:watch', function(){
//     gulp.watch(['./less/*.less', './less/module/*.less'], ['less']);
// });
//
// gulp.task('default', ['less','less:watch']);
