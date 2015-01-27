/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        spinner = {
            addSpinnerOpts: function (spinOpts, spinnerOpts) {
                var k;

                for (k in spinnerOpts) {
                    if (spinnerOpts.hasOwnProperty(k)) {
                        spinOpts[k] = spinnerOpts[k];
                    }
                }

                return spinOpts;
            },
            getOpts: function (t, spinnerOpts) {
                var height = (t.height() - 4),
                    lines = 10,
                    spinOpts = {
                        lines: lines,
                        width: Math.floor(height / lines),
                        length: ((height / 3) * 0.6),
                        radius: ((height / 3) * 0.4),
                        color: t.css("color") || "#000"
                    };

                spinOpts = spinner.addSpinnerOpts(spinOpts, spinnerOpts);

                return spinOpts;
            },
            addSpinnerParentStyles : function (spinnerParent) {
                spinnerParent.css({
                    position: "relative"
                });
            },
            add: function (t, spinnerOpts) {
                var spinOpts = spinner.getOpts(t, spinnerOpts),
                    spinnerObj = new window.Spinner(spinOpts).spin();

                spinner.addSpinnerParentStyles(t);
                t.append(spinnerObj.el);
            },
            get: function (e, spinnerOpts) {
                var t = $(e.target);

                spinner.add(t, spinnerOpts || {});
            },
            bindEvent: function () {
                $("body").on("spinner:get", spinner.get);
            }
        };

    spinner.bindEvent();

}(window));