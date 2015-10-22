/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),
    lessPluginGlob = require("less-plugin-glob"),

    settings = {
        dest: config.compileToFolder + "/css",
        src: ["less/styles.less"],
        options: {
            plugins: [lessPluginGlob]
        },
        comments: {
            all: true
        },

        oldIeSrc: ["less/oldIe/*.less"],
        oldIeFileName: "oldIe.less",

        pleeease: {
            browsers: ["last 4 versions"],
            minifier: false,
            pseudoElements: true,
            filters: {
                oldIE: true
            }
        }
    },

    less = {
        tasks: {
            "less:prod": function () {
                return gulp.src(settings.src)
                    .pipe(plugins.less(settings.options))
                    .pipe(plugins.pleeease(settings.pleeease))
                    .pipe(plugins.minifyCss())
                    .pipe(plugins.stripCssComments(settings.comments))
                    .pipe(gulp.dest(settings.dest));
            },
            "less:dev": function () {
                return gulp.src(settings.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.less(settings.options))
                    .pipe(plugins.pleeease(settings.pleeease))
                    .pipe(plugins.stripCssComments(settings.comments))
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(settings.dest));
            },
            "less:ie:prod": function () {
                return gulp.src(settings.oldIeSrc)
                    .pipe(plugins.concat(settings.oldIeFileName))
                    .pipe(plugins.less(settings.options))
                    .pipe(plugins.pleeease(settings.pleeease))
                    .pipe(plugins.minifyCss())
                    .pipe(plugins.stripCssComments(settings.comments))
                    .pipe(gulp.dest(settings.dest));
            },
            "less:ie:dev": function () {
                return gulp.src(settings.oldIeSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.concat(settings.oldIeFileName))
                    .pipe(plugins.less(settings.options))
                    .pipe(plugins.pleeease(settings.pleeease))
                    .pipe(gulp.dest(settings.dest));
            },
            "less:dev:all": ["less:dev", "less:ie:dev"],
            "default": ["less:dev:all"]
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {
            "less/**": ["less:dev"],
            "less/oldIe/**": ["less:ie:dev"]
        }
    };

module.exports = less;
