'use strict';

var gulp = require('gulp');

gulp.task('js', function() {
    return gulp.src('scripts/*.js', { sourcemaps: true })
        .pipe(gulp.dest('public/js', { sourcemaps: true }));
});
