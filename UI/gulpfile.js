/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    concat = require("gulp-concat"),
    less = require("gulp-less"),
    minifyCSS = require("gulp-minify-css"),
    LessPluginAutoPrefix = require("less-plugin-autoprefix"),
    autoprefix = new LessPluginAutoPrefix({
        browsers: ["last 4 versions"]
    }),
    uglify = require("gulp-uglify"),
    includeSources = require("gulp-include-source"),

    gulpSettings = {

        srcDest: "dist",
        cssDest: "/css",
        jsDest: "/js",

        tasks: {
            "less": function () {
                return gulp.src([
                    "less/fonts/*",
                    "less/vars/*",
                    "less/mixins/*",
                    "less/default/*",
                    "less/grid/*",
                    "less/site/*",
                    "less/pages/*",
                    "less/components/*"
                ])
                .pipe(concat("styles.less"))
                .pipe(less({
                    plugins: [autoprefix]
                }))
                .pipe(minifyCSS())
                .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "js": function () {
                return gulp.src(["js/lib/*.js", "js/*.js"])
                    .pipe(concat("scripts.js"))
                    .pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "odlIeCss" : function () {
                return gulp.src("less/oldIe/*")
                .pipe(concat("oldIe.less"))
                .pipe(less({
                    plugins: [autoprefix]
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
                gulp.watch("js/**.js", ["js", "oldIeJs", "tests"]);

                gulp.watch("less/**/*.less", ["less", "odlIeCss"]);
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