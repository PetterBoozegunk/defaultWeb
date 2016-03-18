/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,

        inputFormat = {
            formats: {
                creditcard: {
                    handlers: {
                        keyup: function () {
                            var t = $(this),
                                val = t.val().replace(/\D+/g, ""),
                                showVal = val.replace(/((\s)?(\d){4})+/g, function (match) {
                                    console.log("match: ", match);

                                    return " " + match;
                                });

                            t.attr("data-value", val);

                            t.val(showVal);
                        }
                    }
                }
            },
            bindFormatEventHandlers: function (formats, format) {
                var body = $("body"),
                    handlers = formats[format].handlers;

                Object.keys(handlers).forEach(function (event) {
                    body.on(event, "input[type=text][data-format='" + format + "']", handlers[event]);
                });
            },
            bindFormatsEventHandlers: function () {
                var formats = inputFormat.formats;

                Object.keys(formats).forEach(function (format) {
                    inputFormat.bindFormatEventHandlers(inputFormat.formats, format);
                });
            }
        };

    inputFormat.bindFormatsEventHandlers();

}(window));