/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    settings = {
        svg: {
            font: {
                src: ["fonts/svg/*.svg"],
                dest: "fonts/svg"
            },
            images: {
                src: ["images/*.svg"],
                dest: "images"
            }
        },
        images: {
            src: ["images/**", "!images/*.svg"],
            dest: "images"
        }
    },
    images = {
        tasks: {
            "svg-min:font": function () {
                return gulp.src(settings.svg.font.src)
                    .pipe(plugins.svgmin())
                    .pipe(gulp.dest(settings.svg.font.dest));
            },
            "svg-min:image": function () {
                return gulp.src(settings.svg.images.src)
                    .pipe(plugins.svgmin())
                    .pipe(gulp.dest(settings.svg.images.dest));
            },
            "image-min": {
                beforetask: ["svg-min:image"],
                task: function () {
                    return gulp.src(settings.images.src)
                        .pipe(plugins.plumber())
                        .pipe(plugins.smushit({
                            verbose: true
                        }))
                        .pipe(gulp.dest(settings.images.dest));
                }
            }
        }
    };

module.exports = images;
