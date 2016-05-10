/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    clean = {
        tasks: {
            "clean": function () {
                return gulp.src(config.compileToFolder + "/**/**")
                    .pipe(plugins.plumber())
                    .pipe(plugins.rimraf());
            }
        }
    };

module.exports = clean;