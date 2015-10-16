/*jslint node: true */
/*global require, Buffer */
"use strict";

var plato = require("plato"),
    chalk = require("chalk"),

    gulp = require("gulp"),
    gutil = require("gulp-util"),

    files = ["*.js", "js/*.js", "js/tests/*.js", "../*.js"],
    outputDir = "./report",
    // null options for this example
    options = {},

    twoDigits = function (digit) {
        return (digit.toString().length < 2) ? "0" + digit : digit;
    },
    callback = function () {
        gutil.log("Plato report done");
    };

plato.inspect(files, outputDir, options, callback);
