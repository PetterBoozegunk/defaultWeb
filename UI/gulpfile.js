/*jslint node: true */
"use strict";

var browsers = ["last 4 versions"],

    gulp = require("gulp"),
    concat = require("gulp-concat"),
    watch = require("gulp-watch"),

    lessPluginGlob = require("less-plugin-glob"),
    less = require("gulp-less"),

    minifyCSS = require("gulp-minify-css"),

    jslint = require("gulp-jslint"),
    uglify = require("gulp-uglify"),

    please = require("gulp-pleeease"),

    util = {
        forEach: function (func, that, obj) {
            var k;

            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    func.call(that, obj[k], k, obj);
                }
            }
        },
        setGulp: function (type, obj) {
            util.forEach(function () {
                var name = arguments[1],
                    funcArray = arguments[0];

                gulp[type](name, funcArray);
            }, this, obj);
        }
    },

    gulpSettings = {

        srcDest: "dist",
        cssDest: "/css",
        jsDest: "/js",
        sourceMapDest: ".",

        //autoprefixerOptions : {
        //    browsers: browsers
        //},
        watch: {
            "js/lib/**.js": ["scripts"],
            "js/**.js": ["scripts", "oldIeJs", "tests"],
            "less/**": ["less", "oldIeCss"]
        },

        tasks: {
            "less": function () {
                return gulp.src("less/styles.less")
                     .pipe(less({
                        plugins: [lessPluginGlob]
                    }))
                    .pipe(please({
                        "browsers": browsers,
                        "minifier": false,
                        "sourcemaps": false,
                        "filters": {
                            "oldIE": true
                        }
                    }))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "oldIeCss": function () {
                return gulp.src("less/oldIe/*")
                    .pipe(concat("oldIe.less"))
                    .pipe(less({
                        plugins: [lessPluginGlob]
                    }))
                    .pipe(minifyCSS())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "jslint": function () {
                return gulp.src(["!js/lib", "js/*.js"])
                    .pipe(jslint());
            },
            "scripts": function () {
                return gulp.src(["js/lib/*.js", "js/*.js"])
                    .pipe(concat("scripts.js"))
                    //.pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "oldIeJs": function () {
                return gulp.src("js/oldIe/*.js")
                    .pipe(concat("oldIe.js"))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "tests": function () {
                return gulp.src(["js/tests/*.js"])
                    .pipe(concat("tests.js"))
                    .pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "watch": function () {
                util.setGulp("watch", gulpSettings.watch);
            },
            "default": ["less", "oldIeCss", "jslint", "scripts", "oldIeJs", "tests", "watch"]
        }
    };

util.setGulp("task", gulpSettings.tasks);