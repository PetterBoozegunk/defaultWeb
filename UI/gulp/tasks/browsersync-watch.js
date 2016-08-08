/*global require */
/*jslint node: true, stupid: true */
"use strict";

var config = require("../config.js"),
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
            //browser: ["firefox", "google chrome", "opera", "iexplore"],
            browser: ["firefox"],
            reloadDelay: 100
        },
        watchFiles: [
            config.compileToFolder + "/css/*.css",
            config.compileToFolder + "/js/*.js",
            "../**/*.phtml"
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