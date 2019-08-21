var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var tsify = require('tsify');

gulp.task('build:ts', function () {
    return browserify()
        .add('./src/main.ts')
        .plugin(tsify)
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js'));
});
