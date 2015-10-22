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
        className: "icon",


        tasks: {
            cpoints: function (codepoints) {
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
            mainTask: function () {
                gulp.src(settings.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.iconfont({
                        fontName: settings.name,
                        normalize: true
                    }))
                    .on("codepoints", settings.cpoints)
                    .pipe(gulp.dest(settings.lessdest));
            }
        }
    },
    iconFont = {

        tasks: {
            "iconFont": {
                beforetask: ["svg-min:font"],
                task: settings.mainTask
            }
        },

        // watch object {"taskName": ["srcArray"]}
        watch: {
            "fonts/svg/*.svg": ["iconFont"]
        }
    };

module.exports = iconFont;