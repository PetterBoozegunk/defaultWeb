/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    reloadTimeout = null,

    settings = {
        delay: 500,
        options: {
            proxy: config.developerRoot,
            browser: "firefox",
            injectChanges: true
        },
        devServer: {
            options: {
                cwd: ".."
            }
        },
        browsersync: require("browser-sync").create()
    },

    reloadBrowser = {
        browsersync: settings.browsersync,

        tasks: {
            "file-watch": function () {
                clearTimeout(reloadTimeout);
                reloadTimeout = setTimeout(settings.browsersync.reload, settings.delay);
            },
            "browser-sync": function () {
                settings.browsersync.init(settings.options);
            },

            "sync-watch": ["browser-sync", "watch"]
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {}
    };

// To add more than one "watch-this-(dir|glob|file)" to do a task use a comma separated string.
reloadBrowser.watch[config.compileToFolder + "/**, pages/**, blocks/**"] = ["file-watch"];

module.exports = reloadBrowser;
