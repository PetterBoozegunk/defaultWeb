/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        tests = {
            "0": function () {
                $(".spinnerTest1").trigger("spinner:get");
            },
            "1": function () {
                $(".spinnerTest2").trigger("spinner:get");
            },
            "2": function () {
                $(".spinnerTest3").trigger("spinner:get", {
                    color: "#90ee90"
                });
            }
        },
        runTests = function () {
            Object.keys(tests).forEach(function (test) {
                tests[test]();
            });
        };

    $(window).load(runTests);

}(window));
