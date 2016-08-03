/*global require *//*jslint node: true */"use strict";var gulp = require("gulp"),    config = require("../config.js"),    plugins = require("gulp-load-plugins")(),    settings = {        src: {            js: ["js/*", "js/**/*"],            sass: ["sass/*", "sass/**/*"]        }    },    convertEncoding = {        tasks: {            "convertEncoding:js": function () {                return gulp.src(settings.src.js)                    .pipe(plugins.convertEncoding({to: 'utf8'}))                    .pipe(gulp.dest('.'));            },            "convertEncoding:sass": function () {                return gulp.src(settings.src.sass)                    .pipe(plugins.convertEncoding({to: 'utf8'}))                    .pipe(gulp.dest('.'));            },            "before:jslint": ["convertEncoding:js"],            "before:sass:lint": ["convertEncoding:sass"]        }    };module.exports = convertEncoding;