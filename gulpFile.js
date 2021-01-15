const { dest, src, watch, parallel } = require('gulp');
const concat = require('gulp-concat');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync');

function images() {
  return src('./src/images/**/*')
    .pipe(dest('./docs/images/'))
    .pipe(browserSync.stream());
}

function audio() {
  return src('./src/audio/**/*')
    .pipe(dest('./docs/audio/'))
    .pipe(browserSync.stream());
}

function styles() {
    return src('./src/scss/*.scss')
        .pipe(scss({ outputStyle: 'expanded' }))
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 5 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(dest('./docs/css/'))
        .pipe(browserSync.stream());
}

function html() {
    return src('./src/*.html')
        .pipe(dest('./docs/'))
        .pipe(browserSync.stream());
}

function js() {
    return src('./src/js/*.js')
        .pipe(webpack())
        .pipe(concat('main.js'))
        .pipe(dest('./docs/js/'))
        .pipe(browserSync.stream());
}

function server() {
    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });
}

function watching() {
    watch('./src/scss/*.scss', parallel(styles));
    watch('./src/*.html', parallel(html));
    watch('./src/js/*.js', parallel(js));
    watch('./src/images/**/*', parallel(images));
    watch('./src/audio/**/*', parallel(audio));
}

exports.build = parallel(styles, html, js, images, audio);
exports.default = parallel(exports.build, server, watching);