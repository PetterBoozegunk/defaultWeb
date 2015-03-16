/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    concat = require("gulp-concat"),

    lessPluginGlob = require("less-plugin-glob"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer"),
    minifyCSS = require("gulp-minify-css"),

    jslint = require('gulp-jslint'),
    uglify = require("gulp-uglify"),

    sourcemaps = require("gulp-sourcemaps"),

    util = {
        eachTask : function (func, that, tasks) {
            var k;

            for (k in tasks) {
                if (tasks.hasOwnProperty(k)) {
                    func.call(that, tasks[k], k, tasks);
                }
            }
        },
        setAllTasks : function (tasks) {
            util.eachTask(function () {
                var taskName = arguments[1],
                    taskFuncOrArray = arguments[0];

                gulp.task(taskName, taskFuncOrArray);
            }, this, tasks);
        }
    },

    gulpSettings = {

        srcDest: "dist",
        cssDest: "/css",
        jsDest: "/js",
        sourceMapDest: "./",
        autoprefixerOptions : {
            browsers: ["last 6 versions"],
            cascade: false,
            remove: true
        },
        watchTasks: {
            "js/lib/**.js": ["scripts"],
            "js/**.js": ["jslint", "scripts", "oldIeJs", "tests"],
            "less/**": ["less", "odlIeCss"]
        },

        tasks: {
            "less": function () {
                return gulp.src("less/styles.less")
                    .pipe(sourcemaps.init())
                    .pipe(less({
                        plugins: [lessPluginGlob]
                    }))
                    .pipe(autoprefixer(gulpSettings.autoprefixerOptions))
                    .pipe(minifyCSS())
                    .pipe(sourcemaps.write(gulpSettings.sourceMapDest))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "jslint" : function () {
                return gulp.src(["!js/lib", "js/*.js"])
                    .pipe(jslint());
            },
            "scripts": function () {
                return gulp.src(["js/lib/*.js", "js/*.js"])
                    .pipe(sourcemaps.init())
                    .pipe(concat("scripts.js"))
                    .pipe(uglify())
                    .pipe(sourcemaps.write(gulpSettings.sourceMapDest))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "oldIeCss" : function () {
                return gulp.src("less/oldIe/*")
                    .pipe(concat("oldIe.less"))
                    .pipe(less({
                        plugins: [lessPluginGlob]
                    }))
                    .pipe(minifyCSS())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "oldIeJs" : function () {
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
            "watch" : function () {
                gulp.task("less/**", ["less", "odlIeCss"]);
            }
        }
    };

util.setAllTasks(gulpSettings.tasks);

gulp.task("default", ["less", "jslint", "scripts", "oldIeCss", "oldIeJs", "tests", "watch"]);