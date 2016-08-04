/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        imageCover = {
            isset: function (t, img) {
                var domain = window.document.domain,
                    backgroundImageRe = new RegExp("(http[s]?:\\/{2}" + domain + "|url\\([\"']?|['\"]?\\))", "g"),
                    backgroundImage = t.css("background-image").replace(backgroundImageRe, "");

                return backgroundImage === img.attr("src");
            },
            set: function () {
                var t = $(this),
                    img = t.find("> img:first"),
                    isset = imageCover.isset(t, img);

                if (!isset) {
                    t.css("background-image", "url(" + img.attr("src") + ")");
                }
            },
            setAll: function () {
                $(".image-cover").each(imageCover.set);
            },
            bindEvent: function () {
                $("body").on("window:resize ajaxSearch:done imageCover:run", imageCover.setAll);
            },
            init: function () {
                imageCover.setAll();
                imageCover.bindEvent();
            }
        };

    imageCover.init();

}(window));
