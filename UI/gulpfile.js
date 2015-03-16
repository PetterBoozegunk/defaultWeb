/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    concat = require("gulp-concat"),

    lessPluginGlob = require("less-plugin-glob"),
    less = require("gulp-less"),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require("gulp-minify-css"),

    jslint = require('gulp-jslint'),
    uglify = require("gulp-uglify"),

    sourcemaps = require("gulp-sourcemaps"),

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

        tasks: {
            "less": function () {
                return gulp.src("less/styles.less")
                    .pipe(sourcemaps.init())
                    .pipe(less({
                        plugins: [lessPluginGlob]
                    }))
                    //.pipe(autoprefixer(gulpSettings.autoprefixerOptions))
                    .pipe(minifyCSS())
                    .pipe(sourcemaps.write(gulpSettings.sourceMapDest))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "jslint" : function () {
                return gulp.src(["!js/lib", "js/*.js"])
                    .pipe(jslint());
            },
            "js": function () {
                return gulp.src(["js/lib/*.js", "js/*.js"])
                    .pipe(sourcemaps.init())
                    .pipe(concat("scripts.js"))
                    .pipe(uglify())
                    .pipe(sourcemaps.write(gulpSettings.sourceMapDest))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "odlIeCss" : function () {
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
                gulp.watch("js/lib/**.js", ["js"]);
                gulp.watch("js/**.js", ["jslint", "js", "oldIeJs", "tests"]);

                gulp.watch("less/**", ["less", "odlIeCss"]);

                gulp.watch("gulpfile.js", tasksArray);
            }
        },
        eachTask : function (func, that) {
            var k,
                tasks = gulpSettings.tasks;

            for (k in tasks) {
                if (tasks.hasOwnProperty(k)) {
                    func.call(that, tasks[k], k, tasks);
                }
            }
        },
        getAllTasks: function () {
            var tasksArray = [];

            gulpSettings.eachTask(function () {
                tasksArray.push(arguments[1]);
            });

            return tasksArray;
        },
        setAllTasks : function () {
            gulpSettings.eachTask(function () {
                var taskName = arguments[1],
                    taskFunc = arguments[0];

                gulp.task(taskName, taskFunc);
            });
        }
    },
    tasksArray = gulpSettings.getAllTasks();

gulpSettings.setAllTasks();
gulp.task("default", tasksArray);