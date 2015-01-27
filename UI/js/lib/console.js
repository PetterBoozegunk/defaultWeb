/*jslint browser: true */
(function (window) {
    "use strict";

    var consoleMethods = [
            "assert",
            "clear",
            "count",
            "debug",
            "dir",
            "dirxml",
            "error",
            "exception",
            "group",
            "groupCollapsed",
            "groupEnd",
            "info",
            "log",
            "profile",
            "profileEnd",
            "table",
            "time",
            "timeEnd",
            "trace",
            "warn",

            "msIsIndependentlyComposed",
            "select"
        ],
        console = window.console || {},
        i,
        l = consoleMethods.length,
        emptyFunc = function () {
            return true;
        };

    for (i = 0; i < l; i += 1) {
        if (!console[consoleMethods[i]] || (console[consoleMethods[i]] && typeof console[consoleMethods[i]] !== "function")) {
            console[consoleMethods[i]] = emptyFunc;
        }
    }

    window.console = console;

}(window));