/*global require */
/*jslint node: true */

var iconFont = {
    name: "icon",
    src: ["fonts/svg/*.svg"],
    lesstemplate: "fonts/templates/icon.less",
    lessdest: "fonts/",
    fontdest: "less/fonts/",
    dir: "/UI/fonts/",
    className: "icon",

    // watch object {"taskName": ["srcArray"]}
    watch: [{
        iconFont: ["fonts/svg/*.svg"]
    }]
};

module.exports = iconFont;
