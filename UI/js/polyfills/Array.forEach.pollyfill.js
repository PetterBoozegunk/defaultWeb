/*jslint browser: true */
(function (window) {
    "use strict";

    var forEach = function (func, that) {
        var i,
            l = this.length || 0;

        for (i = 0; i < l; i += 1) {
            func.call(that, this[i], i, this);
        }
    };

    try {
        [].forEach(function () {});
    } catch (error) {
        window.Array.prototype.forEach = forEach;
    }

}(window));
