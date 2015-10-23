/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    config = {
        compileToFolder: "dist",

        init: function () {
            config.beforetasks = {};
            config.tasks = {};
            config.watch = {};
        }
    };

config.init();

module.exports = config;
