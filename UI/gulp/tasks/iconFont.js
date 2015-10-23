/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    settings = {
        name: "icon",
        src: ["fonts/svg/*.svg"],
        lesstemplate: "fonts/templates/icon.less",
        lessdest: "fonts/",
        fontdest: "less/fonts/",
        dir: "/UI/fonts/",
        className: "icon"
    },
    cpoints = function (codepoints) {
        gulp.src(settings.lesstemplate)
            .pipe(plugins.plumber())
            .pipe(plugins.consolidate("lodash", {
                glyphs: codepoints,
                fontName: settings.name,
                fontPath: settings.dir,
                className: settings.className
            }))
            .pipe(gulp.dest(settings.fontdest));
    },
    mainTask = function () {
        gulp.src(settings.src)
            .pipe(plugins.plumber())
            .pipe(plugins.iconfont({
                fontName: settings.name,
                normalize: true
            }))
            .on("codepoints", cpoints)
            .pipe(gulp.dest(settings.lessdest));
    },
    iconFont = {
        tasks: {
            // This totally unnecessary anonymous function is here because plato.js thinks that it's more maintainable that way. Who am I to disagree...
            "iconFont": (function () {
                return {
                    beforetask: ["svg-min-font"],
                    task: mainTask
                };
            }())
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task (Array)"}
        watch: {
            "fonts/svg/*.svg": ["iconFont"]
        }
    };

module.exports = iconFont;
