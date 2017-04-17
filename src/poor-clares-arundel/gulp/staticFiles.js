'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');

var targets = [
  { description: 'font-awesome-fonts', src: './node_modules/font-awesome/fonts/**/*.*', dest: './wwwroot/fonts' },
  { description: 'bootstrap-fonts', src: './node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*.*', dest: './wwwroot/fonts' },
  { description: 'static-files', src: 'static-files/**/*.*', dest: './wwwroot/' },
  { description: 'templates', src: './src/templates/**/*.html', dest: './wwwroot/templates' }
];

function copy(options) {
  function run(target) {
    gulp.src(target.src)
      .pipe(cache(target.description))
      .pipe(gulp.dest(target.dest));
  }

  function watch(target) {
    gulp.watch(target.src, function() { run(target); });
  }

  targets.forEach(run);

  if (options.shouldWatch) {
    targets.forEach(watch);
  }
}

module.exports = {
  build: function() { return copy({ shouldWatch: false }); },
  watch: function() { return copy({ shouldWatch: true }); }
};
