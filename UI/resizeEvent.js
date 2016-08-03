/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        timeOutId,
        resize = {
            trigger: function () {
                var body = $("body");

                body.trigger("window:resize");

                body.removeClass("resize");
            },
            checkResize: function () {
                clearTimeout(timeOutId);

                $("body:not(.resize)").addClass("resize");

                timeOutId = setTimeout(resize.trigger, 500);
            },
            bindEvents: function () {
                $(window).on("resize", resize.checkResize);
            }
        };

    resize.bindEvents();

}(window));