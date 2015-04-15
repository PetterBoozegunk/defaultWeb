/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    watch = require("gulp-watch"),

    lessPluginGlob = require("less-plugin-glob"),
    stripCssComments = require("gulp-strip-css-comments"),
    less = require("gulp-less"),
    please = require("gulp-pleeease"),

    jslint = require("gulp-jslint"),
    uglify = require("gulp-uglify"),

    imagemin = require("gulp-imagemin"),

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

        less : {
            "plugins": [lessPluginGlob]
        },
        comments: {
            all: true
        },
        please : {
            "browsers": ["last 4 versions"],
            "minifier": false,
            "sourcemaps": false,
            "filters": {
                "oldIE": true
            }
        },

        watch : {
            "js/lib/**.js": ["scripts:main"],
            "js/**.js": ["scripts:main", "scripts:ie", "tests"],
            "less/**": ["less:main", "less:ie"]
        },

        tasks: {
            "less:main": function () {
                return gulp.src("less/styles.less")
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:ie" : function () {
                return gulp.src("less/oldIe/*")
                    .pipe(concat("oldIe.less"))
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "jslint" : function () {
                return gulp.src(["!js/lib", "js/*.js"])
                    .pipe(jslint());
            },
            "scripts:main": function () {
                return gulp.src(["js/lib/*.js", "js/*.js"])
                    .pipe(concat("scripts.js"))
                    .pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "scripts:ie" : function () {
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
            "images": function () {
                return gulp.src("images/**")
                    .pipe(imagemin())
                    .pipe(gulp.dest("images/"));
            },
            "watch": function () {
                util.setGulp("watch", gulpSettings.watch);
            },
            "default": ["less:main", "less:ie", "jslint", "scripts:main", "scripts:ie", "tests", "images", "watch"]
        }
    };

util.setGulp("task", gulpSettings.tasks);