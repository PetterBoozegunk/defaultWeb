/*global require */
/*jslint node: true */
"use strict";

var config = require("./gulp/config.js"),
    tasksnwatch = require("./gulp/tasksnwatch.js");

// Sets where the js av css files will end up (default is "dist")
//config.compileToFolder = "dist";

// This is used in /UI/gulp/tasks/browsersync-watch.js
// (default is "http://localhost/")
config.developerRoot = "http://defaultweb.local:666/";

tasksnwatch.init();

// Checkout /UI/gulp/tasks/examples.js
// for instructions how to gulp with an almost empty glupfile.
