/*jslint node: true */
/*global require, Buffer */
"use strict";

var plato = require("plato"),
    colors = require("colors"),

    files = ["*.js", "js/*.js", "js/tests/*.js", "../*.js"],
    outputDir = "./report",
    // null options for this example
    options = {},

    twoDigits = function (digit) {
        return (digit.toString().length < 2) ? "0" + digit : digit;
    },
    callback = function () {
        var now = new Date(),
            h = twoDigits(now.getHours()),
            m = twoDigits(now.getMinutes()),
            s = twoDigits(now.getSeconds()),

            time = (h + ":" + m + ":" + s).grey;

        console.log("[" + time + "] Plato report done");
    };

plato.inspect(files, outputDir, options, callback);
