/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    removeJsonFiles = function (fileName) {
        return !/\.json$/.test(fileName);
    },

    defaultProperties = {
        files: ["*.js"],
        concat: true, // concat to '/UI/Dist/js/scripts.js'
        prettify: true, // prettify before jslint
        check: true // check with jslint & eslint
    },

    settings = {
        dest: config.compileToFolder + "/js",
        fileName: "scripts.js",

        src: [{
            dir: "js/polyfills/",
            check: false,
            prettify: false
        }, {
            dir: "js/bower/**/dist/",
            check: false,
            prettify: false
        }, {
            dir: "js/lib/",
            check: false,
            prettify: false
        }, {
            dir: "js/plugins_external/",
            check: false,
            prettify: false
        }, {
            dir: "js/plugins/"
        }, {
            dir: "js/"
        }, {
            dir: "js/tests/"
        }, {
            dir: "gulp/",
            concat: false
        }, {
            dir: "gulp/tasks/",
            concat: false
        }, {
            dir: "../server/",
            files: ["*.js", "*.json"],
            concat: false
        }, {
            dir: "../",
            files: ["server.js"],
            concat: false
        }, {
            dir: "./",
            files: ["*.js", "*.json"],
            concat: false
        }],

        concat: [],
        check: [],
        prettify: [],

        jsLint: {
            jslint_happy: true
        },
        esLint: {
            configFile: ".eslintrc"
        },

        uglify: {
            compress: {
                drop_debugger: true,
                drop_console: true
            }
        }
    },

    setupJsTaskSettings = require("../setupJsTaskSettings.js"),

    js = {
        checkSrc: settings.check,
        prettify: function (src, dest) {
            return gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(plugins.jsPrettify(settings.jsLint))
                .pipe(gulp.dest(dest));
        },
        tasks: {
            "js:platoReport": function () {
                gulp.start(plugins.shell.task(["node gulp/plato.js simple"]));
            },
            "js:prettify": function () {
                var prettifyArray = settings.prettify;

                prettifyArray.forEach(function (prettifyObj) {
                    js.prettify(prettifyObj.files, prettifyObj.dest);
                });
            },
            "before:js:lint": ["js:prettify"],
            "js:lint": function () {
                return gulp.src(settings.check)
                    .pipe(plugins.plumber())
                    .pipe(plugins.jslint())
                    .pipe(plugins.jslint.reporter("default", true))
                    .pipe(plugins.jslint.reporter("stylish", {}));
            },
            "es:lint": function () {
                return gulp.src(settings.check.filter(removeJsonFiles))
                    .pipe(plugins.plumber())
                    .pipe(plugins.eslint(settings.esLint))
                    .pipe(plugins.eslint.format())
                    .pipe(plugins.eslint.failAfterError());
            },
            "js:prod": function () {
                return gulp.src(settings.concat)
                    .pipe(plugins.concat(settings.fileName))
                    .pipe(plugins.stripDebug())
                    .pipe(plugins.uglify(settings.uglify))
                    .pipe(gulp.dest(settings.dest));
            },
            "js:dev": function () {
                return gulp.src(settings.concat)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.concat(settings.fileName))
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(settings.dest));
            },

            "js:lint:all": ["js:lint", "es:lint"],
            "js:all": ["js:lint:all", "js:platoReport", "js:dev"],

            // All "default" tasks will be added to the main default task
            "default": ["js:dev"]
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task (Array)"}
        watch: {
            "js/**": ["js:dev"]
        }
    };

setupJsTaskSettings.init(settings, defaultProperties);

module.exports = js;