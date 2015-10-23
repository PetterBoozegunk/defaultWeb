/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    config = {
        // Sets where the js av css files will end up
        compileToFolder: "dist",

        // This is used in /UI/gulp/tasks/preloadBrowser.js
        developerRoot: "http://defaultweb.local:666/",

        beforetasks: {},
        tasks: {},
        watch: {}
    };

module.exports = config;
