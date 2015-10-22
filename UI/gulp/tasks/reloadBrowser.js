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
            proxy: "http://defaultweb.local:666/",
            browser: "firefox"
        }
    },

    reloadBrowser = {
        tasks: {
            "file-watch": function () {
                setTimeout(browsersync.reload, settings.delay);
            },
            "browser-sync": function () {
                browsersync.init(settings.options);
            },
            "sync-watch": ["browser-sync", "watch"]
        },
        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {
            "dist/**": ["file-watch"],
            "pages/**": ["file-watch"],
            "blocks/**": ["file-watch"]
        }
    };

module.exports = reloadBrowser;
