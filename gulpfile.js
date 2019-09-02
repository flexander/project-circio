var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var tsify = require('tsify');
const sass = require('gulp-sass');

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

gulp.task('build:scss', () => {
    return gulp.src('./styles/*.scss')
        .pipe(sass())
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', function() {
    gulp.watch(['src/*.ts', 'src/**/*.ts'], gulp.series('build:ts'));
    gulp.watch(['styles/*.scss'], gulp.series('build:scss'));
});
