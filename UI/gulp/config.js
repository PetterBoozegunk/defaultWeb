/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    config = {
        compileToFolder: "dist",
        developerRoot: "http://localhost/",

        beforetasks: {},
        tasks: {},
        watch: {}
    };

module.exports = config;
