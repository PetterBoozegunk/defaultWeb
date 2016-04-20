/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        timeOutId,
        scroll = {
            trigger: function () {
                var body = $("body");

                body.trigger("document:scroll");
            },
            setScrollTop: function () {
                clearTimeout(timeOutId);

                timeOutId = setTimeout(scroll.trigger, 500);
            },
            bindEvents: function () {
                $(document).on("scroll", scroll.setScrollTop);
            }
        };

    scroll.bindEvents();

}(window));