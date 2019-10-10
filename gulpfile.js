/**
 * PLUG-INS
 */
const { gulp, series, parallel, src, dest, watch } = require('gulp');
const babel      = require('gulp-babel'),
      prefix     = require('autoprefixer'),
      concat     = require('gulp-concat'),
      livereload = require('gulp-livereload'),
      sass       = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      stripCSS   = require('gulp-strip-css-comments'),
      stripJS    = require('gulp-strip-comments'),
      postcss    = require('gulp-postcss'),
      terser     = require('gulp-terser');
/**
 * OPTIONS
 */
const terserOptions = {
                        output: {
                          beautify: false,
                          comments: false, // default is FALSE
                          // comments: '/^[!*]/', // default is FALSE
                          indent_level: 2,
                          ecma: 7,
                          quote_style: 0
                        },
                        ecma: 7,
                        keep_fnames: true,
                        mangle: true, // default
                        toplevel: false,
                        warnings: "verbose",
                      };
                      // https://github.com/terser/terser#minify-options
const babelOptions = {
                          "presets": ["@babel/preset-env",{"sourceType": "unambiguous","compact":false}],
                          "plugins": [
                                        ["@babel/plugin-transform-arrow-functions", { "spec": true }]
                                      ]
                      };
const stripJSOptions = {safe: true, ignore: /url\([\w\s:\/=\-\+;,]*\)/g};

/**
 * TASKS / FUNCTIONS
 */
function workScript(intended) {
  return function script() {
    if (intended=='src/js/glob*.js') {
      targetFile = 'global.js';
    } else if (intended=='src/js/dash*.js') {
      targetFile = 'dashboard.js';
    } else if (intended=='src/js/work*.js') {
      targetFile = 'workflow.js';
    }
    return src(intended,{allowEmpty: true}) // returning ES6 files
          .pipe(sourcemaps.init())
          .pipe(concat(targetFile))
          .pipe(terser(terserOptions))
          .pipe(sourcemaps.write('.'))
          .pipe(dest('./es6')).on('end', function() {
            return src(intended,{allowEmpty: true}) // returning ES5 files
            .pipe(sourcemaps.init())
            .pipe(concat(targetFile))
            .pipe(babel(babelOptions))
            .pipe(stripJS(stripJSOptions))
            .pipe(sourcemaps.write('.'))
            .pipe(dest('./es5'));
          })
          .pipe(livereload()).on('end', function() {
            console.log('Changes pushed...'+'\n');
          });
  };
}
function preFlight() {
  console.log('Welcome Avinash!\n'+'Presets Loaded..'+'\n'+'LiveReload Server is now hawk-eyeing your changes...'+'\n');
  livereload.listen();
}
function hawkEye() {
  watch('src/js/glob*.js',series(workScript('src/js/glob*.js')));
  watch('src/js/dash*.js',series(workScript('src/js/dash*.js')));
  watch('src/js/work*.js',series(workScript('src/js/work*.js')));
}

exports.default = parallel(preFlight, hawkEye);