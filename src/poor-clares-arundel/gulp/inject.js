'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var glob = require('glob');

function injectIndex(options) {
  function run() {
    var target = gulp.src('./src/index.html');
    var sources = gulp.src([
      './wwwroot/styles/main*.css',
      './wwwroot/scripts/vendor*.js',
      './wwwroot/scripts/main*.js'
    ], { read: false });

    return target
      .pipe(inject(sources, { ignorePath: '/wwwroot/', addRootSlash: false, removeTags: true }))
      .pipe(gulp.dest('./wwwroot'));
  }

  var jsCssGlob = 'wwwroot/**/*.{js,css}';

  function checkForInitialFilesThenRun() {
    glob(jsCssGlob, function (er, files) {
      var filesWeNeed = ['wwwroot/scripts/main', 'wwwroot/scripts/vendor', 'wwwroot/styles/main'];

      function fileIsPresent(fileWeNeed) {
        return files.some(function(file) {
          return file.indexOf(fileWeNeed) !== -1;
        });
      }

      if (filesWeNeed.every(fileIsPresent)) {
        run('initial build');
      } else {
        checkForInitialFilesThenRun();
      }
    });
  }

  checkForInitialFilesThenRun();

  if (options.shouldWatch) {
    gulp.watch(jsCssGlob, function(evt) {
      if (evt.path && evt.type === 'changed') {
        run(evt.path);
      }
    });
  }
}

module.exports = {
  build: function() { return injectIndex({ shouldWatch: false }); },
  watch: function() { return injectIndex({ shouldWatch: true  }); }
};
