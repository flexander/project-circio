'use strict';

let babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sass       = require('gulp-sass');

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
    return browserify(config.js.src)
        .transform(babelify, { presets : ["@babel/preset-env"] })
        .bundle()
        .pipe(source(config.js.src))
        .pipe(buffer())
        .pipe(rename(config.js.outputFile))
        .pipe(gulp.dest(config.js.outputDir));
}

function styles () {
    return gulp.src(config.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.css.outputDir));
}

exports.scripts = scripts;
exports.styles = styles;
exports.default = gulp.series(scripts, styles);