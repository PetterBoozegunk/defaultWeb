/*global require */
/*jslint node: true, stupid: true */
"use strict";

var fs = require("fs"),

    settings = {
        srcDest: "dist"
    },

    setup = {
        specialCases: {
            "browserSync": function () {
                return {
                    "browser-sync": require("./settings/browserSync.js")
                };
            },
            "imagesSvgs": function () {
                return {
                    svg: require("./settings/imagesSvgs.js").svg,
                    images: require("./settings/imagesSvgs.js").images
                };
            }
        },
        addSpecialCases: function (specialCaseObj) {
            Object.keys(specialCaseObj).forEach(function (name) {
                settings[name] = specialCaseObj[name];
            });
        },

        // Gets all files from ./gulpStuff/settings and adds them to the "settings" object.
        // If the filename is found in the "specialCases" object the properties of the specialCases object will be added instead of the file/module.
        init: function () {
            var files = fs.readdirSync("./gulpStuff/settings");

            files.forEach(function (fileName) {
                var fileNameStripJs = fileName.replace(/\.js$/, "");

                if (setup.specialCases[fileNameStripJs]) {
                    setup.addSpecialCases(setup.specialCases[fileNameStripJs]());
                } else {
                    settings[fileNameStripJs] = require("./settings/" + fileName);
                }

            });
        }
    };

setup.init();

module.exports = settings;
