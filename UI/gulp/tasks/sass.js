/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    lazypipe = require("lazypipe"),

    settings = {
        dest: config.compileToFolder + "/css",
        src: ["sass/styles.scss"],
        comments: {
            all: true
        },
        lint: {
            src: [
                "sass/**/*.scss"
            ],
            options: {
                config: "sass/scss-lint.yml"
            }
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
            .pipe(plugins.pleeease, settings.pleeease)
            .pipe(plugins.shorthand)
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
            "sass:lint": function () {
                return gulp.src(settings.lint.src)
                    .pipe(plugins.scssLint(settings.lint.options));
            },
            "before:sass:dev": ["sass:lint"],
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