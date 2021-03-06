const { src, dest, watch , parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    css:'css/**/*.css',
    js: 'js/**/*.js',
    imagenes: 'build/img/**/*'
}

// css es una función que se puede llamar automaticamente
function css() {
    return src(paths.css)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css') );
}

function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js')) // final output file name
      .pipe(terser())
    //   .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 100, })))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function watchArchivos() {
    watch( paths.js, javascript );
    watch( paths.css, css );
    // watch( paths.imagenes, imagenes );
    watch( paths.imagenes, versionWebp );
}

exports.webp = versionWebp;
exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, versionWebp, watchArchivos );