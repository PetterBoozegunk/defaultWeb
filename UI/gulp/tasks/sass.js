/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    lazypipe = require("lazypipe"),

    settings = {
        dest: config.compileToFolder + "/css",
        src: ["sass/styles-sass.scss"],
        comments: {
            all: true
        },

        pleeease: {
            browsers: ["last 4 versions"],
            minifier: false,
            pseudoElements: true,
            cascade: false,
            filters: {
                oldIE: false
            }
        }
    },

    mainLessPipe = (function () {
        return lazypipe()
            .pipe(plugins.sassGlob)
            .pipe(plugins.sass)
            .pipe(plugins.shorthand)
            .pipe(plugins.pleeease, settings.pleeease)
            .pipe(plugins.stripCssComments, settings.comments)
            .pipe(plugins.removeEmptyLines);
    }()),

    sass = {
        tasks: {
            "sass:prod": function () {
                return gulp.src(settings.src)
                    .pipe(mainLessPipe())
                    .pipe(plugins.cssnano())
                    .pipe(gulp.dest(settings.dest));
            },
            "sass:dev": function () {
                return gulp.src(settings.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(mainLessPipe())
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(settings.dest));
            },

            // All "default" tasks will be added to the main default task
            "default": ["sass:dev"]
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task (Array)"}
        watch: {
            "sass/**": ["sass:dev"]
        }
    };

module.exports = sass;