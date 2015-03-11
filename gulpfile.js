var gulp = require('gulp'),
    browserify = require('gulp-browserify');

gulp.task('build', function(){
    return gulp.src(['./src/bbq.js'])
        .pipe(browserify())
        .pipe(gulp.dest('./dist/'));
});

// Default Task
gulp.task('default', ['build']);
