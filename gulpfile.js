const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const broswerSync = require('browser-sync').create();

// Compile scss

function style() {
    // 1. Where is my scss
    return gulp.src('./scss/**/*.scss')
    // 2. Compile that stuff
        .pipe(sass().on('error', sass.logError))
    // 3. Where does it end up?
        .pipe(gulp.dest('./css'))
    // 4. Browser sync stuff
        .pipe(broswerSync.stream());
}

function compress() {
    return gulp.src('./js/**/*.js')
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true
    }))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(broswerSync.stream());
}

function minifyCss() {
    return gulp.src('./css/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({compatibility: '*'}))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/styles'))
        //.pipe(broswerSync.stream());
}

function watch() {
    broswerSync.init({
        server:{
            baseDir: './'
        }
    });
    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./js/**/*.js', compress);
    gulp.watch('./css/*.css', minifyCss);
    gulp.watch('./*.html').on('change', broswerSync.reload);
    gulp.watch('./dist/scripts/**/*.min.js').on('change', broswerSync.reload);
    gulp.watch('./dist/styles/**/*.min.css').on('change', broswerSync.reload);
}

exports.style = gulp.series(style, minifyCss);
exports.minifyJS = compress;
exports.minifyCSS = minifyCss;
exports.watch = watch;
exports.nGo = gulp.series(style, minifyCss, compress, watch);