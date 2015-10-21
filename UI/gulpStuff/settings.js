/*global require */
/*jslint node: true */
"use strict";

var lessPluginGlob = require("less-plugin-glob"),

    settings = {
        srcDest: "dist",

        less: {
            dest: "/css",
            src: ["less/styles.less"],
            options: {
                plugins: [lessPluginGlob]
            },
            oldIeSrc: ["less/oldIe/*.less"],
            oldIeFileName: "oldIe.less",

            // watch object {"taskName": ["srcArray"]}
            watch: [{
                "less:dev": ["less/**"]
            }, {
                "less:ie:dev": ["less/oldIe/**"]
            }]
        },
        js: {
            dest: "/js",
            fileName: "scripts.js",

            concatSrc: ["js/polyfills/*.js", "js/lib/*.js", "js/plugins_external/*.js", "js/plugins/*.js", "js/*.js", "js/tests/*.js"],
            checkSrc: ["js/*.js", "js/plugins/*.js", "js/tests/*.js", "*.js", "gulpStuff/*.js", "../../server.js"],

            jsLint: {
                js: {
                    jslintHappy: true
                }
            },

            oldIeFileName: "oldIe.js",
            oldIeSrc: ["js/oldIe/*.js"],

            watch: [{
                "js:dev": ["js/polyfills/*.js", "js/lib/*.js", "js/plugins_external/*.js", "js/plugins/*.js", "js/*.js", "js/tests/*.js"]
            }, {
                "js:ie:dev": ["js/oldIe/*.js"]
            }]
        },

        comments: {
            all: true
        },
        please: {
            browsers: ["last 4 versions"],
            minifier: false,
            pseudoElements: true,
            filters: {
                oldIE: true
            }
        },
        svg: {
            font: {
                src: ["fonts/svg/*.svg"],
                dest: "fonts/svg"
            },
            images: {
                src: ["images/*.svg"],
                dest: "images"
            }
        },
        images: {
            src: ["images/**", "!images/*.svg"],
            dest: "images"
        },
        iconFont: {
            name: "icon",
            src: ["fonts/svg/*.svg"],
            lesstemplate: "fonts/templates/icon.less",
            lessdest: "fonts/",
            fontdest: "less/fonts/",
            dir: "/UI/fonts/",
            className: "icon",
            watch: [{
                iconFont: ["fonts/svg/*.svg"]
            }]
        },
        "browser-sync": {
            options: {
                // proxy should be set to the current local developer server.
                proxy: require("../../server/settings.json").hostname + ":" + require("../../server/settings.json").port,
                browser: "firefox"
            }
        },
        browserReload: {
            stream: true
        },
        fileWatch: {
            delay: 500,
            watch: [{
                "file-watch": ["[srcDest]/**", "../blocks/**", "../pages/**"]
            }]
        }
    };

module.exports = settings;
