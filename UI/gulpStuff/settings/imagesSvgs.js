/*global require */
/*jslint node: true */
"use strict";

var imagesSvgs = {
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
    }
};

module.exports = imagesSvgs;
