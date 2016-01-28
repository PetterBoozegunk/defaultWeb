/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    runTimestamp = Math.round(Date.now() / 1000),

    settings = {
        name: "icon",
        src: ["fonts/svg/*.svg"],
        lesstemplate: "fonts/templates/icon.less",
        lessdest: ".",
        fontdest: "less/fonts/",
        dir: "/UI/fonts/",
        className: "icon",
        formats: ["svg", "ttf", "eot", "woff", "woff2"]
    },
    glyphs = function (glyphs) {
        gulp.src(settings.lesstemplate)
            .pipe(plugins.plumber())
            .pipe(plugins.consolidate("lodash", {
                glyphs: glyphs,
                fontName: settings.name,
                fontPath: settings.dir,
                className: settings.className
            }))
            .pipe(gulp.dest(settings.fontdest));
    },
    mainTask = function () {
        return gulp.src(settings.src)
            .pipe(plugins.plumber())
            .pipe(plugins.iconfont({
                fontName: settings.name,
                appendUnicode: true,
                normalize: true,
                formats: settings.formats,
                timestamp: runTimestamp
            }))
            .on("glyphs", glyphs)
            .pipe(gulp.dest(settings.lessdest));
    },

    iconFont = {
        tasks: {
            "iconFont": mainTask
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task (Array)"}
        watch: {
            "fonts/svg/*.svg": ["iconFont"]
        }
    };

module.exports = iconFont;