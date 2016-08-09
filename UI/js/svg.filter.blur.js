/*jslint browser: true */
(function (window) {
    "use strict";
    var $ = window.jQuery,
        util = {
            trim: function (str) {
                return str.toString().replace(/(^\s+|\s+$)/g, "").replace(/^\[object\sobject\]$/i, "");
            },
            isIe10Or11: function () {
                return (window.docModeIE && window.docModeIE >= 10);
            }
        },
        blur = {
            getWidth: function (parent, img) {
                return (parent.offsetWidth < img.offsetWidth) ? parent.offsetWidth : img.offsetWidth;
            },
            getDims: function (img) {
                var parent = img.offsetParent,
                    width = blur.getWidth(parent, img);

                return {
                    width: width,
                    height: img.offsetHeight
                };
            },
            getSvgElemStart: function (img, blurBy, dims) {
                return "<svg id=\"blur-" + blurBy + "\" class=\"" + util.trim(img.className) + "\" style=\"width: " + dims.width + "px; height: " + dims.height + "px;\">";
            },
            getFilterElem: function (blurBy) {
                return "<filter id=\"blur-filter-" + blurBy + "\"><feGaussianBlur stdDeviation=\"" + blurBy + "\" /></filter>";
            },
            getImageElem: function (img, dims) {
                return "<image x=\"0\" y=\"0\" width=\"" + dims.width + "\" height=\"" + dims.height + "\" xlink:href=\"" + img.src + "\" />";
            },
            createSvg: function (img, blurBy) {
                var dims = blur.getDims(img),
                    svgElemStr = blur.getSvgElemStart(img, blurBy, dims);

                svgElemStr += blur.getFilterElem(blurBy);
                svgElemStr += blur.getImageElem(img, dims);
                svgElemStr += "</svg>";

                return $(svgElemStr);
            },
            svg: function () {
                var t = $(this),
                    blurBy = t.attr("data-ie-blur"),
                    svg = blur.createSvg(this, blurBy);

                t.replaceWith(svg);

                svg.find("image").attr("filter", "url(#blur-filter-" + blurBy + ")");
            },
            init: function () {
                var isIe10Or11 = util.isIe10Or11();

                if (isIe10Or11) {
                    $("[data-ie-blur]").each(blur.svg);
                }
            }
        };

    $(window).on("load", blur.init);

}(window));