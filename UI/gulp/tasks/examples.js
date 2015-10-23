﻿/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    config = require("../config.js"),
    plugins = require("gulp-load-plugins")(),

    lessPluginGlob = require("less-plugin-glob"),

    settings = {
        // add settings here
        dest: config.compileToFolder + "/examples",

        src: ["less/styles.less"],
        options: {
            plugins: [lessPluginGlob]
        }
    },
    examples = {
        tasks: {
            // How to define a task:
            "example1": function () {
                console.log("example1");
            },

            // How to use settings
            "example2" : function () {
                return gulp.src(settings.src)
                    .pipe(plugins.less(settings.options))
                    .pipe(gulp.dest(settings.dest));
            },

            // How to add an array of tasks before another task
            // The task "clean" will run before the "examples" task
            "before:examples" : ["clean"],

            // Set an array of tasks to be run 
            "examples": ["example1", "example2"],

            // Add tasks to the default task.
            // This will be run when running "gulp" 
            "default": ["example1"]
        }
    };

module.exports = examples;