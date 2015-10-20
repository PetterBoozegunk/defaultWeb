/*jslint node: true */
/*global require, Buffer */
"use strict";


var plato = require("plato"),
    path = require("path"),
    //fs = require("fs"),

    gutil = require("gulp-util"),

    args = process.argv,
    argsLength = args.length,
    filePath = args[argsLength - 1].replace(/\%20/g, " "),

    p = {
        files: [filePath],
        outputDir: "./report",
        // null options for this example
        options: {},

        config: {
            "maintainability-min": 75,
            "loc-max": 6 // loc = Lines Of Code
        },
        pass: {},

        getColor: function (bool) {
            return (bool === true) ? "green" : "red";
        },

        checkMinMax: function (type, minMax) {
            return p.config[type + "-" + minMax] ? minMax : "";
        },
        getMinMax: function (type) {
            var max = p.checkMinMax(type, "max"),
                min = p.checkMinMax(type, "min");

            return max || min;
        },
        maxCheck: function (configValue, value) {
            return (value <= configValue) ? true : false;
        },
        minCheck: function (configValue, value) {
            return (value >= configValue) ? true : false;
        },
        checkFilePass: function (fileName) {
            return (p.pass[fileName] === undefined || p.pass[fileName] === true);
        },
        setFilePass: function (fileName, pass) {
            if (p.checkFilePass(fileName)) {
                p.pass[fileName] = pass;
            }
        },
        checkPass: function (configValue, minMax, value, fileName) {
            var pass = configValue ? p[minMax + "Check"](configValue, value) : false;

            p.setFilePass(fileName, pass);

            return pass;
        },
        setDigitColor: function (name, itemObj) {
            var value = itemObj.complexity[name],
                minMax = p.getMinMax(name),
                configValue = p.config[name + "-" + minMax],
                pass = p.checkPass(configValue, minMax, value, itemObj.info.file),
                color = p.getColor(pass);

            return gutil.colors[color](value.toFixed(2));
        },
        getCheckArray: function (checkArray) {
            Object.keys(p.config).forEach(function (fullName) {
                var name = fullName.replace(/\-(min|max)/, "");

                checkArray.push(name);
            });

            return checkArray;
        },
        getLogArray: function (itemObj, logArray) {
            var checkArray = p.getCheckArray([]);

            checkArray.forEach(function (name) {
                logArray.push("\n\t\t" + gutil.colors.grey(name) + ":");
                logArray.push(p.setDigitColor(name, itemObj));
            });

            return logArray;
        },
        logReport: function (report) {
            Object.keys(report).forEach(function (item) {
                var logArray = p.getLogArray(report[item], []),
                    color = p.getColor(p.pass[report[item].info.file]);

                logArray.splice(0, 0, gutil.colors[color](path.parse(report[item].info.file).base));

                gutil.log.apply(undefined, logArray);
            });
        },
        callback: function (report) {
            p.logReport(report);
        },
        init: function () {
            return plato.inspect(p.files, p.outputDir, p.options, p.logReport);
        }
    };

p.init();