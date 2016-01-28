/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        util = {
            returnObject: function (obj) {
                return (!obj) ? {} : obj;
            }
        },
        spinner = {
            copy: function (k, spinOpts, spinnerOpts) {
                spinOpts[k] = spinnerOpts[k];
            },
            addSpinnerOpts: function (spinOpts, spinnerOpts) {
                spinnerOpts = util.returnObject(spinnerOpts);

                Object.keys(spinnerOpts).forEach(function (name) {
                    spinOpts[name] = spinnerOpts[name];
                });

                return spinOpts;
            },
            opts: function (t, height, lines) {
                return {
                    lines: lines,
                    width: Math.floor(height / lines),
                    length: ((height / 3) * 0.6),
                    radius: ((height / 3) * 0.4),
                    color: t.css("color") || "#000"
                };
            },
            getOpts: function (t, spinnerOpts) {
                var height = (t.height() - 4),
                    lines = 10,
                    spinOpts = spinner.opts(t, height, lines);

                spinOpts = spinner.addSpinnerOpts(spinOpts, spinnerOpts);

                return spinOpts;
            },
            addSpinnerParentStyles: function (spinnerParent) {
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

                spinner.add(t, spinnerOpts);
            },
            bindEvent: function () {
                $("body").on("spinner:get", spinner.get);
            }
        };

    spinner.bindEvent();

}(window));