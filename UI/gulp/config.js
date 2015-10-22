/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    config = {
        compileToFolder: "dist",

        // All tasks (both 'task' and 'watch' tasks) are found in the files in /UI/gulp/tasks/*.js
        tasks: {
            "clean": function () {
                return gulp.src(config.compileToFolder)
                    .pipe(plugins.rimraf());
            }
        },
        init: function () {
            config.watch = {};
        }
    };

config.init();

module.exports = config;
