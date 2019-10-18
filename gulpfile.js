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
                          "presets": ["@babel/preset-env",{"sourceType": "unambiguous","compact":true}],
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

function workScriptES5(intendedJS) {
  return function scriptES5() {
    // console.log("Starting ES5:",intendedJS.match(/[.\w*]+$/g)[0].toUpperCase(),"...");
    if (intendedJS=="src/js/glob*.js") {
      targetFile = "global.js";
    } else if (intendedJS=="src/js/dash*.js") {
      targetFile = "dashboard.js";
    } else if (intendedJS=="src/js/work*.js") {
      targetFile = "workflow.js";
    }
    return src(intendedJS,{allowEmpty: true}) // returning ES5 files
          .pipe(sourcemaps.init())
          .pipe(concat(targetFile))
          .pipe(babel(babelOptions))
          // .pipe(stripJS(stripJSOptions))
          .pipe(sourcemaps.write("."))
          .pipe(dest("./dist/js/es5").on("finish", ()=> {
              // console.log("Worked on Script ES5:",targetFile.toUpperCase(),"...saved.");
            }));
  };
}

function workScriptES6(intendedJS) {
  return function scriptES6() {
    console.log("Starting ES6:",intendedJS.match(/[.\w*]+$/g)[0].toUpperCase(),"...");
    if (intendedJS=="src/js/glob*.js") {
      targetFile = "global.js";
    } else if (intendedJS=="src/js/dash*.js") {
      targetFile = "dashboard.js";
    } else if (intendedJS=="src/js/work*.js") {
      targetFile = "workflow.js";
    }
    return src(intendedJS,{allowEmpty: true}) // returning ES6 files
            .pipe(sourcemaps.init())
            .pipe(concat(targetFile))
            .pipe(terser(terserOptions))
            // .pipe(stripJS(stripJSOptions))
            .pipe(sourcemaps.write("."))
            .pipe(dest("./dist/js/es6").on("finish", ()=> {
              console.log("Worked on Script ES6:",targetFile.toUpperCase(),"...saved.");
            }));
  };
}

function workSass(intendedSASS) {
  return function style() {
    console.log("Starting:",intendedSASS.match(/[.\w*]+$/g)[0].toUpperCase(),"...");
    return src(intendedSASS, {allowEmpty: true})
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on("error", sass.logError)) // ALSO https://github.com/sass/node-sass#render-callback--v300
            .pipe(postcss(postcssOptions))
            .pipe(stripCSS({preserve: /^!|@|#/}))
            .pipe(sourcemaps.write("."))
            .pipe(dest("./dist/styles").on("finish", ()=> {
              livereload.reload();
              console.log("Worked on Styles:",intendedSASS.match(/[.\w*]+$/g)[0].toUpperCase(),"...stored. Changes pushed.");
            }));
            /*.pipe(dest("./dist/styles"))
            .pipe(livereload().on("end", ()=> {
              console.log("Worked on Styles:",intendedSASS.match(/[.\w*]+$/g)[0].toUpperCase(),"...stored. Changes pushed.");
            }));*/
  };
}

function serveUp() {
  console.log("Welcome Avinash!\n"+"Presets are loaded, Preflight is done too.. the Server is now hawk-eyeing changes...");
  livereload.listen();
}

function hawkEye() {
  watch("src/js/glob*.js",parallel(workScriptES5("src/js/glob*.js"),workScriptES6("src/js/glob*.js")));
  watch("src/js/dash*.js",parallel(workScriptES5("src/js/dash*.js"),workScriptES6("src/js/dash*.js")));
  watch("src/js/work*.js",parallel(workScriptES5("src/js/work*.js"),workScriptES6("src/js/work*.js")));
  watch("dist/js/es6/*.js").on('change', function(path, stats) {livereload.reload(path);});
  // SASS FILES FROZEN SINCE THEY ARE READY. THEREFORE EXCLUDED IN THIS DEV.
}

exports.default = series(
                         // scripts
                        parallel(workScriptES5("src/js/glob*.js"),workScriptES6("src/js/glob*.js")),
                        parallel(workScriptES5("src/js/dash*.js"),workScriptES6("src/js/dash*.js")),
                        parallel(workScriptES5("src/js/work*.js"),workScriptES6("src/js/work*.js")),
                        //styles
                        workSass("src/sass/bootstrap431/bootstrap.scss"),
                        workSass("src/sass/mycss.sass"), // oldSetupFiles
                        workSass("src/sass/dashboard.sass"), // oldSetupFiles
                        // serving and watching
                        parallel(serveUp,hawkEye)
                        );
exports.SASS = series(
                      workSass("src/sass/bootstrap431/bootstrap.scss"),
                      workSass("src/sass/mycss.sass"), // oldSetupFiles
                      workSass("src/sass/dashboard.sass") // oldSetupFiles
                      );
exports.JS = series(
                    parallel(workScriptES5("src/js/glob*.js"),workScriptES6("src/js/glob*.js")),
                    parallel(workScriptES5("src/js/dash*.js"),workScriptES6("src/js/dash*.js")),
                    parallel(workScriptES5("src/js/work*.js"),workScriptES6("src/js/work*.js"))
                    );
