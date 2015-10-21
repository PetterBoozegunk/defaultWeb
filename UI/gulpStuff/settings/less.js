/*global require */
/*jslint node: true */
"use strict";

var lessPluginGlob = require("less-plugin-glob"),

    less = {
        dest: "/css",
        src: ["less/styles.less"],
        options: {
            plugins: [lessPluginGlob]
        },
        comments: {
            all: true
        },

        oldIeSrc: ["less/oldIe/*.less"],
        oldIeFileName: "oldIe.less",

        // watch object {"taskName": ["srcArray"]}
        watch: [{
            "less:dev": ["less/**"]
        }, {
            "less:ie:dev": ["less/oldIe/**"]
        }]
    };

module.exports = less;
