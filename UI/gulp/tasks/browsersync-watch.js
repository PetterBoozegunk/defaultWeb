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
                target: config.developerRoot //,
                    //proxyRes: [function (res) {
                    //    res.headers["content-encoding"] = "gzip";
                    //}]
            },
            browser: ["firefox", "google chrome", "opera", "iexplore"],
            reloadDelay: 100
        },
        watchFiles: [
            config.compileToFolder + "/css/*.css",
            config.compileToFolder + "/js/*.js",
            "../pages/**",
            "../blocks/**"
        ]
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
browsersyncWatch.watch[settings.watchFiles.toString()] = ["file-watch"];

module.exports = browsersyncWatch;
