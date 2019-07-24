'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');


gulp.task('js', function() {
    return gulp.src('scripts/*.js', { sourcemaps: true })
        .pipe(gulp.dest('public/js', { sourcemaps: true }));
});

gulp.task('scripts', function() {
    return gulp.src(
        ['scripts/fourCircles.js'])
        .pipe(babel({presets: ["@babel/preset-env"]}))
        .pipe(browserify())
        .pipe(gulp.dest('public/js'))
});
