/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    settings = {
        dest: "./bower_components",
        filesDest: "./js/bower"
    },

    bower = {
        tasks: {
            "bower": function () {
                return plugins.bower()
                    .pipe(gulp.dest(settings.dest));
            },
            "before:bower-files": ["bower"],
            "bower-files": function () {
                return gulp.src("./bower.json")
                    .pipe(plugins.mainBowerFiles("/\\.(min|slim)\\.js$/"))
                    .pipe(gulp.dest(settings.filesDest));
            },
            "default": ["bower-files"]
        }
    };

module.exports = bower;