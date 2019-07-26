'use strict';

var babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream');

var config = {
    js: {
        src: './scripts/index.js',
        outputDir: './public/js/',
        outputFile: 'index.js'
    },
};

function scripts () {

    let bundler = browserify(config.js.src)
        .transform(babelify, { presets : ["@babel/preset-env"] });

    return bundler
        .bundle()
        .pipe(source(config.js.src))
        .pipe(buffer())
        .pipe(rename(config.js.outputFile))

        .pipe(gulp.dest(config.js.outputDir));
}

exports.scripts = scripts;
exports.default = gulp.series(scripts);