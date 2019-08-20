'use strict';

let babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sass       = require('gulp-sass');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

let config = {
    js: {
        src: './scripts/index.js',
        outputDir: './public/js/',
        outputFile: 'index.js'
    },
    css: {
        src: './styles/index.scss',
        outputDir: './public/css/',
        outputFile: 'index.css'
    }
};

function scripts () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('public/js/'));
}

function styles () {
    return gulp.src(config.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.css.outputDir));
}

function styles () {
    return gulp.src(config.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.css.outputDir));
}

exports.scripts = scripts;
exports.styles = styles;
exports.default = gulp.series(scripts, styles);