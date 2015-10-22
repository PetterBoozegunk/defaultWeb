/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    settings = {
        dest: config.compileToFolder + "/js",
        fileName: "scripts.js",

        concatSrc: ["js/polyfills/*.js", "js/lib/*.js", "js/plugins_external/*.js", "js/plugins/*.js", "js/*.js", "js/tests/*.js"],
        checkSrc: ["js/*.js", "js/plugins/*.js", "js/tests/*.js", "*.js", "gulp/**", "../../server.js"],

        prettify: [{
            files: ["js/*.js"],
            dest: "js"
        }, {
            files: ["js/polyfills/*.js"],
            dest: "js/polyfills"
        }, {
            files: ["js/plugins/*.js"],
            dest: "js/plugins"
        }, {
            files: ["js/tests/*.js"],
            dest: "js/tests"
        }, {
            files: ["gulp/**"],
            dest: "gulp"
        }, {
            files: ["gulp/tasks/**"],
            dest: "gulp/tasks"
        }, {
            files: ["../server/**"],
            dest: "../server"
        }, {
            files: ["../server.js"],
            dest: ".."
        }],

        jsLint: {
            js: {
                jslintHappy: true
            }
        },
        uglify: {
            compress: {
                drop_debugger: true,
                drop_console: true
            }
        },

        oldIeFileName: "oldIe.js",
        oldIeSrc: ["js/oldIe/*.js"]
    },

    js = {
        checkSrc: settings.checkSrc,
        prettify: function (src, dest) {
            return gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(plugins.jsbeautifier(settings.jsLint))
                .pipe(gulp.dest(dest));
        },
        tasks: {
            "platoReport": function () {
                gulp.start(plugins.shell.task(["node gulp/plato.js simple"], {
                    verbose: true
                }));
            },
            "prettify": function () {
                var prettifyArray = settings.prettify;

                prettifyArray.forEach(function (prettifyObj) {
                    js.prettify(prettifyObj.files, prettifyObj.dest);
                });
            },
            "jslint": {
                beforetask: ["prettify"],
                task: function () {
                    return gulp.src(settings.checkSrc)
                        .pipe(plugins.plumber())
                        .pipe(plugins.jslint());
                }
            },
            "js:prod": function () {
                return gulp.src(settings.concatSrc)
                    .pipe(plugins.concat(settings.fileName))
                    .pipe(plugins.uglify(settings.uglify))
                    .pipe(gulp.dest(settings.dest));
            },
            "js:dev": function () {
                return gulp.src(settings.concatSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.concat(settings.fileName))
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(settings.dest));
            },
            "js:ie:dev": function () {
                return gulp.src(settings.oldIeSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.concat(settings.oldIeFileName))
                    .pipe(gulp.dest(settings.dest));
            },
            "js:ie:prod": function () {
                return gulp.src(settings.oldIeSrc)
                    .pipe(plugins.concat(settings.oldIeFileName))
                    .pipe(gulp.dest(settings.dest));
            },
            "js:dev:all": ["js:dev", "js:ie:dev"],

            "js:all": ["jslint", "platoReport", "js:dev:all"],

            "default": ["js:dev:all"]
        },
        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {
            "js/**": ["js:dev:all"]
        }
    };

module.exports = js;