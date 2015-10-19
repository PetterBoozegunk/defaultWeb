/*jslint node: true */
/*global require, Buffer */
"use strict";

var plato = require("plato"),

    gulp = require("gulp"),
    gutil = require("gulp-util"),

    files = ["*.js", "js/plugins/*.js", "js/*.js", "js/tests/*.js", "../*.js"],
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
        console.log(" ");
        gutil.log(gutil.colors.magenta("node plato..."));

        Object.keys(report).forEach(function (item) {
            var itemObj = report[item],
                color = getColor(itemObj.complexity),
                reportStr = "maintainability: " + itemObj.complexity.maintainability.toFixed(2) + ", loc: " + itemObj.complexity.loc.toFixed(2);

            gutil.log(gutil.colors[color](itemObj.info.file), gutil.colors.grey(reportStr));
        });
    };

plato.inspect(files, outputDir, options, callback);
