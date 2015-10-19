/*jslint node: true */
/*global require, Buffer */
"use strict";

var plato = require("plato"),

    gulp = require("gulp"),
    gutil = require("gulp-util"),

    files = ["*.js", "js/*.js", "js/tests/*.js", "../*.js"],
    outputDir = "./report",
    // null options for this example
    options = {},

    config = {
        "maintanability-min": 75,
        "loc-max": 6 // loc = Lines Of Code
    },

    twoDigits = function (digit) {
        return (digit.toString().length < 2) ? "0" + digit : digit;
    },
    getColor = function (complexity) {
        var maintainability = complexity.maintainability,
            loc = complexity.loc,
            color = (maintainability < config["maintanability-min"] || loc > config["loc-max"]) ? "red" : "green";

        return color;
    },
    callback = function (report) {
        Object.keys(report).forEach(function (item) {
            var itemObj = report[item],
                color = getColor(itemObj.complexity),
                reportStr = "maintainability: " + Math.round(itemObj.complexity.maintainability) + ", loc: " + Math.round(itemObj.complexity.loc);

            gutil.log(gutil.colors[color](itemObj.info.file), gutil.colors.grey(reportStr));
        });
    };

plato.inspect(files, outputDir, options, callback);
