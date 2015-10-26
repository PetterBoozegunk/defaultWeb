/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    devServer = {
        options : {
            cwd: ".."
        },
        tasks: {
            "devServer": function () {
                gulp.start(plugins.shell.task(["start node server.js"], devServer.options));
            },
            "before:sync-watch": ["devServer"]
        }
    };

module.exports = devServer;
