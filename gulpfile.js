var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var tsify = require('tsify');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');

gulp.task('build:ts-browser', function () {
    return browserify()
        .add('./src/main.ts')
        .plugin(tsify)
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('build:ts-cli', function () {
    return tsProject.src()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(tsProject())
        .js.pipe(gulp.dest('animate'));
});

gulp.task('build:scss', () => {
    return gulp.src('./styles/*.scss')
        .pipe(sass())
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', function() {
    gulp.watch(['src/*.ts', 'src/**/*.ts'], gulp.parallel(['build:ts-browser','build:ts-cli']));
    gulp.watch(['styles/*.scss'], gulp.series('build:scss'));
});
