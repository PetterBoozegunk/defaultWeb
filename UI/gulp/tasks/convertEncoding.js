/*global require */
/*jslint node: true */

"use strict";
var gulp = require("gulp"),
    //config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    settings = {
        options: {
            to: "utf8"
        },
        src: {
            js: [
                "*.js",
                "gulp/**",
                "js/**",
                "bower/**/*.js",
                "bower_components/**/*.js"
            ],
            sass: ["sass/**"]
        }
    },

    convert = function (src) {
        return gulp.src(src)
            .pipe(plugins.convertEncoding(settings.options))
            .pipe(gulp.dest(function(file) {
                return file.base;
            }));
    },

    convertEncoding = {
        tasks: {
            "convertEncoding:js": function () {
                return convert(settings.src.js);
            },
            "convertEncoding:sass": function () {
                return convert(settings.src.sass);
            },
            "before:default": ["convertEncoding:js", "convertEncoding:sass"],
        }
    };

module.exports = convertEncoding;
