/*global require */
/*jslint node: true */
"use strict";

var pleeease = {
    browsers: ["last 4 versions"],
    minifier: false,
    pseudoElements: true,
    filters: {
        oldIE: true
    }
};

module.exports = pleeease;
