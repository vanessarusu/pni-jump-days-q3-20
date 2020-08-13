// based on https://css-tricks.com/gulp-for-wordpress-creating-the-tasks/

import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
// import livereload from 'gulp-livereload';
import del from 'del';

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
  return src('src/assets/scss/bundle.scss')
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'))
    // .pipe(livereload());
}

export const scripts = () => {
  return src('src/assets/js/scripts.js')
  .pipe(dest('dist/js'))
  // .pipe(livereload());
}

export const changes = () => {
  // livereload.listen();
  watch('src/assets/scss/**/*.scss', styles);
  watch('src/assets/js/**/*.js', scripts);
  watch(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'], copy);
}

export const copy = () => {
  return src(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'])
    .pipe(dest('dist'));
}

export const clean = () => del(['dist']);


export const dev = series(clean, parallel(styles, scripts, copy), changes);

export const build = series(clean, parallel(styles, copy))

export default dev;