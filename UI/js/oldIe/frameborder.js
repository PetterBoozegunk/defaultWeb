/*jslint browser: true */
(function (window) {
    "use strict";

    window.attachEvent("onload", function () {
        var iframes = document.getElementsByTagName("iframe"),
            newIframe,
            i,
            l = iframes.length;

        for (i = 0; i < l; i += 1) {
            newIframe = iframes[i].cloneNode(true);
            newIframe.setAttribute("frameborder", "0");

            iframes[i].parentNode.replaceChild(newIframe, iframes[i]);
        }
    });

}(window));