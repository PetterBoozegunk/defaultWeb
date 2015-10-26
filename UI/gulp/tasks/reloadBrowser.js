/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    browsersync = require("browser-sync").create(),
    reload = browsersync.reload,

    settings = {
        delay: 500,
        options: {
            proxy: config.developerRoot,
            browser: "firefox"
        },
        devServer: {
            options: {
                cwd: ".."
            }
        }
    },
    reloadBrowser = {
        tasks: {
            "devServer:start": function () {
                gulp.start(plugins.shell.task(["start node server.js"], settings.devServer.options));
            },

            "file-watch": function () {
                setTimeout(browsersync.reload, settings.delay);
            },
            "browser-sync:start": function () {
                browsersync.init(settings.options);
            },

            "before:browser-sync:start": ["watch"]
        },
        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {
            "dist/**": ["file-watch"],
            "pages/**": ["file-watch"],
            "blocks/**": ["file-watch"]
        }
    };

module.exports = reloadBrowser;
