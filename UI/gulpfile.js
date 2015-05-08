/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    watch = require("gulp-watch"),

    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,

    lessPluginGlob = require("less-plugin-glob"),
    stripCssComments = require("gulp-strip-css-comments"),
    less = require("gulp-less"),

    please = require("gulp-pleeease"),
    minifyCSS = require("gulp-minify-css"),

    jslint = require("gulp-jslint"),
    uglify = require("gulp-uglify"),

    imagemin = require("gulp-imagemin"),

    sourcemaps = require("gulp-sourcemaps"),

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
            util.forEach(function (funcArray, name) {
                gulp[type](name, funcArray); // "funcArray" === "function OR Array"
            }, this, obj);
        }
    },

    gulpSettings = {

        srcDest: "dist",
        cssDest: "/css",
        jsDest: "/js",

        lessSrc: ["less/styles.less"],
        less: {
            "plugins": [lessPluginGlob]
        },
        jsSrc: ["js/lib/*.js", "js/*.js", "js/tests/*js"],

        comments: {
            all: true
        },
        please: {
            "browsers": ["last 4 versions"],
            "minifier": false,
            "filters": {
                "oldIE": true
            }
        },

        watch: {
            "js/lib/**.js": ["scripts:dev"],
            "js/**.js": ["scripts:dev"],
            "js/oldIe/**.js": ["scripts:ie:dev"],

            "less/**": ["less:dev"],
            "less/oldIe/**": ["less:ie:dev"] //,

            //"dist/**/*.js": ["file-watch"],
            //"dist/**/*.css": ["file-watch"],
            //"../Views/**/*.cshtml": ["file-watch"],
            //"../Views/**/**/*.cshtml": ["file-watch"]
        },

        tasks: {
            "watch": function () {
                util.setGulp("watch", gulpSettings.watch);
            },
            "file-watch": function () {
                setTimeout(browserSync.reload, 500);
            },
            "browser-sync": function () {
                browserSync.init({
                    proxy: "http://defaultweb.local"
                });
            },

            "images": function () {
                return gulp.src("images/**")
                    .pipe(imagemin())
                    .pipe(gulp.dest("images/"));
            },
            "jslint": function () {
                return gulp.src(["!js/lib", "js/*.js", "js/tests/*.js", "gulpfile.js"])
                    .pipe(jslint());
            },

            "less:prod": function () {
                return gulp.src(gulpSettings.lessSrc)
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(minifyCSS())
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:dev": function () {
                return gulp.src(gulpSettings.lessSrc)
                    .pipe(sourcemaps.init())
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "less:ie:prod": function () {
                return gulp.src("less/oldIe/*.less")
                    .pipe(concat("oldIe.less"))
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(minifyCSS())
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:ie:dev": function () {
                return gulp.src("less/oldIe/*.less")
                    .pipe(concat("oldIe.less"))
                    .pipe(less(gulpSettings.less))
                    .pipe(please(gulpSettings.please))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload({
                        stream: true
                    }));
            },

            "scripts:prod": function () {
                return gulp.src(gulpSettings.jsSrc)
                    .pipe(concat("scripts.js"))
                    .pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "scripts:dev": function () {
                return gulp.src(gulpSettings.jsSrc)
                    .pipe(sourcemaps.init())
                    .pipe(concat("scripts.js"))
                    .pipe(sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "scripts:ie:dev": function () {
                return gulp.src("js/oldIe/*.js")
                    .pipe(concat("oldIe.js"))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "scripts:ie:prod": function () {
                return gulp.src("js/oldIe/*.js")
                    .pipe(concat("oldIe.js"))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },

            "default": ["less:dev", "less:ie:dev", "scripts:dev", "scripts:ie:dev", "images", "jslint"],

            //"sync-watch": ["browser-sync", "watch"],

            "dev": ["less:dev", "less:ie:dev", "scripts:dev", "scripts:ie:dev"],
            "prod": ["less:prod", "less:ie:prod", "scripts:prod", "scripts:ie:prod"]
        }
    };

util.setGulp("task", gulpSettings.tasks);