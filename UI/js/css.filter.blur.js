/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        blur = {
            getDims: function (img) {
                var parent = img.offsetParent,
                    width = (parent.offsetWidth < img.offsetWidth) ? parent.offsetWidth : img.offsetWidth;
                return {
                    width: width,
                    height: img.offsetHeight
                };
            },
            createSvg : function (img, blurBy) {
                var dims = blur.getDims(img),
                    svgElemStr = "<svg id=\"blur-" + blurBy + "\" class=\"" + (img.className || "") + "\" style=\"width: " + dims.width + "px; height: " + dims.height + "px;\">";

                svgElemStr += "<filter id=\"blur-filter-" + blurBy + "\"><feGaussianBlur stdDeviation=\"" + blurBy + "\" /></filter>";
                svgElemStr += "<image x=\"0\" y=\"0\" width=\"" + dims.width + "\" height=\"" + dims.height + "\" xlink:href=\"" + img.src + "\" />";
                svgElemStr += "</svg>";

                return $(svgElemStr);
            },
            svg : function () {
                var t = $(this),
                    blurBy = t.attr("data-ie-blur"),
                    svg = blur.createSvg(this, blurBy);

                t.replaceWith(svg);

                svg.find("image").attr("filter", "url(#blur-filter-" + blurBy + ")");
            },
            init : function () {
                $("[data-ie-blur]").each(blur.svg);
            }
        };

    if (window.docModeIE && window.docModeIE >= 10) {
        $(window).on("load", blur.init);
    }

}(window));