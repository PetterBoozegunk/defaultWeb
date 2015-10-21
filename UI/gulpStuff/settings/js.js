/*global require */
/*jslint node: true */
"use strict";

var js = {
    dest: "/js",
    fileName: "scripts.js",

    concatSrc: require("./concatJsFiles.js"),
    checkSrc: ["js/*.js", "js/plugins/*.js", "js/tests/*.js", "*.js", "gulpStuff/**", "../../server.js"],

    prettify: [{
        files: ["js/*.js"],
        dest: "js"
    }, {
        files: ["js/polyfills/*.js"],
        dest: "js/polyfills"
    }, {
        files: ["js/plugins/*.js"],
        dest: "js/plugins"
    }, {
        files: ["js/tests/*.js"],
        dest: "js/tests"
    }, {
        files: ["gulpStuff/**"],
        dest: "gulpStuff"
    }, {
        files: ["*.js", "package.json"],
        dest: "."
    }, {
        files: ["../server.js"],
        dest: ".."
    }],

    jsLint: {
        js: {
            jslintHappy: true
        }
    },
    uglify: {
        compress: {
            drop_debugger: true,
            drop_console: true
        }
    },

    oldIeFileName: "oldIe.js",
    oldIeSrc: ["js/oldIe/*.js"],

    // watch object {"taskName": ["srcArray"]}
    watch: [{
        "js:dev": require("./concatJsFiles.js")
    }, {
        "js:ie:dev": ["js/oldIe/*.js"]
    }]
};

module.exports = js;
