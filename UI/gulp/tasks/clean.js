/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    clean = {
        tasks: {
            "clean": function () {
                return gulp.src(config.compileToFolder + "/**")
                    .pipe(plugins.rimraf());
            },

            // This will make file-watch crash, just so you know :)
            "before:prod": ["clean"]
        }
    };

module.exports = clean;