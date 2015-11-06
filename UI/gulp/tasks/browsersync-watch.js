/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    reloadTimeout = null,

    bs = require("browser-sync").create(),
    reload = bs.reload,

    settings = {
        options: {
            proxy: {
                target: config.developerRoot,
                proxyRes: [function (res) {
                    res.headers["content-encoding"] = "gzip";
                }]
            },
            browser: ["firefox"],
            reloadDelay: 500
        }
    },

    browsersyncWatch = {
        tasks: {
            "file-watch": function () {
                reload();
            },
            "browser-sync": function () {
                bs.init(settings.options);
            },

            "sync-watch": ["browser-sync", "watch"]
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task"}
        watch: {}
    };

// To add more than one "watch-this-(dir|glob|file)" to do a task use a comma separated string.
browsersyncWatch.watch[config.compileToFolder + "/**, pages/**, blocks/**"] = ["file-watch"];

module.exports = browsersyncWatch;
