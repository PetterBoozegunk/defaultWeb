/*global require */
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
            "example2": function () {
                return gulp.src(settings.src)
                    .pipe(plugins.less(settings.options))
                    .pipe(gulp.dest(settings.dest));
            },

            // How to add an array of tasks before another task
            // The task "clean" will run before the "examples" task
            "before:examples": ["clean"], // This HAS to be an Array

            // Set an array of tasks to be run 
            "examples": ["example1", "example2"],

            // To add a task to a list of tasks just end the name with :listName
            // In this example "devExample:dev" will run when "gulp dev" is run.
            "example:dev": function () {
                console.log("example:dev");
            },
            // This is the same as the example abowe but it will run when "gulp prod" is run.
            "example:prod": function () {
                console.log("example:prod");
            },

            // Add tasks to the default task.
            // This will run when running "gulp" 
            "default": ["example1"] // This HAS to be an Array
        },

        // The task "example1" will run when "(UI/)gulp/tasks/examples.js" is changed
        watch: {
            "gulp/tasks/examples.js": ["example1"] // This HAS to be an Array
        }
    };

module.exports = examples;
