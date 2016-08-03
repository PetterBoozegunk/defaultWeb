/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    settings = {

    },

    assemble = {
        tasks: {
            "assemble": function () {

            }
        },

        // watch object {"watch-this-(dir|glob|file)": "do-this-task (Array)"}
        watch: {

        }
    };

module.exports = assemble;