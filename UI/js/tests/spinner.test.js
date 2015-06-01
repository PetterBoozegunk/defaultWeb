/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        spinnerTest = {
            addSpinners: function () {
                $(".spinnerTest1").trigger("spinner:get");
                $(".spinnerTest2").trigger("spinner:get");
                $(".spinnerTest3").trigger("spinner:get", {
                    color: "#90ee90"
                });
            }
        };

    $(window).load(spinnerTest.addSpinners);

}(window));
