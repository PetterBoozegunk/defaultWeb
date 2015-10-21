/*global require */
/*jslint node: true */
"use strict";

var browserSync = {
    options: {
        // proxy should be set to the current local developer server.
        proxy: require("../../../server/settings.json").hostname + ":" + require("../../../server/settings.json").port,
        browser: "firefox"
    },

    delay: 500,

    // watch object {"taskName": ["srcArray"]}
    watch: [{
        "file-watch": ["[srcDest]/**", "../blocks/**", "../pages/**"]
    }]
};

module.exports = browserSync;
