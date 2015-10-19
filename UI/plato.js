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
        var color = "green",
            maintainability = complexity.maintainability,
            loc = complexity.loc;

        if (maintainability < config["maintanability-min"] || loc > config["loc-max"]) {
            color = "red";
        }


        return color;
    },
    callback = function (report) {
        Object.keys(report).forEach(function (item) {
            var itemObj = report[item],
                color = getColor(itemObj.complexity);

            gutil.log(gutil.colors[color](itemObj.info.file));
        });
    };

plato.inspect(files, outputDir, options, callback);
