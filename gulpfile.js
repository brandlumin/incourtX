
// =========================================================
// GULPFILE - PURPOSE SPECIFIC
// =========================================================

// REQUIRE SECTION -----------------------------------------
const autoprefixer = require('autoprefixer'),
      babel        = require('gulp-babel'),
      concat       = require('gulp-concat'),
      gulp         = require('gulp'),
      livereload   = require('gulp-livereload'),
      sass         = require('gulp-sass'),
      sourcemaps   = require('gulp-sourcemaps'),
      stripCSS     = require('gulp-strip-css-comments'),
      stripJS      = require('gulp-strip-comments'),
      postcss      = require('gulp-postcss'),
      terser       = require('gulp-terser');

const terserOptions = {
                        output: {
                          beautify: false,
                          indent_level: 2,
                          ecma: 5,
                          quote_style: 0
                        },
                        ecma: 5,
                        keep_fnames: true,
                        mangle: true, // default
                        toplevel: false,
                        warnings: "verbose",
                      };
                      // https://github.com/terser/terser#minify-options
const babelOptions = {
                          presets: ['@babel/env'],// compact: false,
                          sourceType: "unambiguous"
                      };
// ---------------------------------------------------------



// JS SECTION // ---------------------------------------
gulp.task('globaljs', function () {
  return gulp.src('src/js/global.js')
        .pipe(sourcemaps.init())
        .pipe(terser(terserOptions))
        .pipe(stripJS({safe: true,
                      ignore: /url\([\w\s:\/=\-\+;,]*\)/g}))
        // .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./es6'));
});
gulp.task('globaljsES5', function () {
  return gulp.src('./es6/global.js')
        .pipe(sourcemaps.init())
        .pipe(babel(babelOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./es5'))
        .pipe(livereload());
});
// JS SECTION // ---------------------------------------
gulp.task('workflowjs', function () {
  return gulp.src('src/js/dash*.js')
        .pipe(sourcemaps.init())
        .pipe(terser(terserOptions))
        .pipe(stripJS({safe: true,
                      ignore: /url\([\w\s:\/=\-\+;,]*\)/g}))
        .pipe(concat('dash.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./es6'));
});
gulp.task('workflowjsES5', function () {
  return gulp.src('./es6/dash.js')
        .pipe(sourcemaps.init())
        .pipe(babel(babelOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./es5'))
        .pipe(livereload());
});
// ---------------------------------------------------------


// SERVE SECTION // ----------------------------------------
gulp.task('serve', function(){ // This just displayes upon run and triggers the livereload listen to changes
  console.log(
              '\n' + 'LiveReload Server is now listening to your changes in files...' + '\n'
              );
  livereload.listen();
});
// ---------------------------------------------------------


// WATCH SECTION // ----------------------------------------
gulp.task('watch:sass', function () {
  // gulp.watch('src/sass/**/*.s?ss', gulp.series('workflowcss','dashcss'));
});

gulp.task('watch:js', function () {
  gulp.watch('src/js/dash*.js', gulp.series(['workflowjs','workflowjsES5']));
  gulp.watch('src/js/global.js', gulp.series(['globaljs','globaljsES5']));
});

gulp.task('watch:frontend', function () {
  gulp.watch(['**/*.html','**/*.php']).on('change', livereload.reload);
});

gulp.task('watch', gulp.parallel('watch:sass','watch:js','watch:frontend'));
// ---------------------------------------------------------



// REQUIRE SECTION // --------------------------------------
gulp.task('default', gulp.series(
                                 'workflowjs',
                                 'workflowjsES5',
                                 'globaljs',
                                 'globaljsES5',
                                  gulp.parallel(
                                                'watch',
                                                'serve'
                                                )
                                )
);
// ---------------------------------------------------------
