'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var src = './styles/main.scss';
var dest = './wwwroot/styles';

function compile(options) {
  function run(done) {
    return gulp.src(src)
      .on('end', function() { if (done) { done(); } })
      .pipe(gulpif(options.isDevelopment, sourcemaps.init()))
      .pipe(sass({
          includePaths: [
              '.',
              './node_modules'
          ]
      }).on('error', sass.logError))
      .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
      .pipe(gulpif(!options.isDevelopment, cssmin()))
      .pipe(gulpif(!options.isDevelopment, rename(function (path) {
        path.basename += '-' + new Date().toISOString().replace(/:/g, '-');
      })))
      .pipe(gulpif(options.isDevelopment, sourcemaps.write()))
      .pipe(gulp.dest(dest));
  }

  if (options.shouldWatch) {
    gulp.watch('./styles/**/*.scss', function() { run(); });
  }

  return new Promise(function(resolve, reject) {
    run(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve('scss');
      }
    });
  });
}

module.exports = {
  build: function() { return compile({ isDevelopment: false, shouldWatch: false }); },
  watch: function() { return compile({ isDevelopment: true,  shouldWatch: true });  }
};
