/*global require */
/*jslint node: true */
"use strict";

var settings = {
    srcDest: "dist",

    less: require("./settings/less.js"),
    js: require("./settings/js.js"),

    pleeease: require("./settings/pleeease.js"),

    svg: require("./settings/imagesSvgs.js").svg,
    images: require("./settings/imagesSvgs.js").images,

    iconFont: require("./settings/iconFont.js"),
    "browser-sync": require("./settings/browserSync.js")
};

module.exports = settings;
