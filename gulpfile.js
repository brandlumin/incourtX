/**
 * PLUG-INS
 */
const { gulp, series, parallel, src, dest, watch } = require("gulp");
const babel      = require("gulp-babel"),
      prefix     = require("autoprefixer"),
      concat     = require("gulp-concat"),
      livereload = require("gulp-livereload"),
      sass       = require("gulp-sass"),
      sourcemaps = require("gulp-sourcemaps"),
      stripCSS   = require("gulp-strip-css-comments"),
      stripJS    = require("gulp-strip-comments"),
      postcss    = require("gulp-postcss"),
      terser     = require("gulp-terser");
/**
 * OPTIONS
 */
const terserOptions = {
                        output: {
                          beautify: false,
                          comments: false, // default is FALSE
                          // comments: "/^[!*]/", // default is FALSE
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
const sassOptions = {
                  errLogToConsole: true,
                  // linefeed: "lf",
                  precision: 10,
                  outputStyle: "compressed" //"nested" //"compressed""
                  };
const postcssOptions = [ prefix({browsers: ["> 0.01% in IN", "iOS 4"], grid: true}) ];

/**
 * TASKS / FUNCTIONS
 */
function workScript(intendedJS) {
  return function script() {
    if (intendedJS=="src/js/glob*.js") {
      targetFile = "global.js";
    } else if (intendedJS=="src/js/dash*.js") {
      targetFile = "dashboard.js";
    } else if (intendedJS=="src/js/work*.js") {
      targetFile = "workflow.js";
    }
    // console.log(intendedJS);
    // console.log(targetFile);
    return src(intendedJS,{allowEmpty: true}) // returning ES6 files
            .pipe(sourcemaps.init())
            .pipe(concat(targetFile))
            .pipe(terser(terserOptions))
            .pipe(stripJS(stripJSOptions))
            .pipe(sourcemaps.write("."))
            .pipe(dest("./dist/js/es6")).on("end", function() {
              return src(intendedJS,{allowEmpty: true}) // returning ES5 files
                      .pipe(sourcemaps.init())
                      .pipe(concat(targetFile))
                      .pipe(babel(babelOptions))
                      .pipe(stripJS(stripJSOptions))
                      .pipe(sourcemaps.write("."))
                      .pipe(dest("./dist/js/es5"));
                      // .pipe(livereload()); // to push es5 into the browser
            })
            .pipe(livereload().on("end", function() {console.log("worked on:",intendedJS," -- Changes pushed...");}));
  };
}

function workSass(intendedSASS) {
  return function style() {
    // console.log("working on:",intendedSASS);
    return src(intendedSASS, {allowEmpty: true})
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on("error", sass.logError)) // ALSO https://github.com/sass/node-sass#render-callback--v300
            .pipe(postcss(postcssOptions))
            .pipe(stripCSS({preserve: /^!|@|#/}))
            .pipe(sourcemaps.write("."))
            .pipe(dest("./dist/styles"))
            .pipe(livereload().on("end", function() {console.log("worked on:",intendedSASS," -- Changes pushed...");}));
  };
}

function serveUp() {
  console.log("Welcome Avinash!\n"+"Presets are loaded, Preflight is done too.. the Server is now hawk-eyeing changes...");
  livereload.listen();
}

function hawkEye() {
  watch("src/js/glob*.js",workScript("src/js/glob*.js"));
  watch("src/js/dash*.js",workScript("src/js/dash*.js"));
  watch("src/js/work*.js",workScript("src/js/work*.js"));
  watch(["src/sass/bootstrap431/**/*.*"], workSass("src/sass/bootstrap431/bootstrap.scss"));
  watch(["src/sass/dashboard.sass","src/sass/dashboard/**/*.*"], workSass("src/sass/dashboard.sass"));
  watch(["src/sass/workflow.sass","src/sass/workflow/**/*.*"], workSass("src/sass/workflow.sass"));
}

exports.default = series(
                         parallel(
                                  workScript("src/js/glob*.js"),
                                  workScript("src/js/dash*.js"),
                                  workScript("src/js/work*.js"),
                                  workSass("src/sass/bootstrap431/bootstrap.scss"),
                                  workSass("src/sass/dashboard.sass"),
                                  workSass("src/sass/workflow.sass")
                         ),
                         parallel(serveUp,hawkEye)
                         );