/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        tests = {
            "0": function () {
                $(".spinner-test1").trigger("spinner:get");
            },
            "1": function () {
                $(".spinner-test2").trigger("spinner:get");
            },
            "2": function () {
                $(".spinner-test3").trigger("spinner:get", {
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