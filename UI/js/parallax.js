/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,

        viewPort = {
            top: 0,
            height: 0,
            bottom: 0
        },

        util = {
            getViewPort: function () {
                viewPort = {
                    top: window.pageYOffset,
                    height: window.innerHeight,
                    bottom: parseFloat(window.pageYOffset + window.innerHeight)
                };

                return viewPort;
            },
            getElemDims: function (elem) {
                var jqElem = $(elem);

                return {
                    top: jqElem.offset().top,
                    height: jqElem.height(),
                    bottom: parseFloat(jqElem.offset().top + jqElem.height())
                };
            }
        },

        parallax = {
            elems: $(".parallax"),

            elemIsInViewPort: function (elemDims) {
                return (elemDims.top < viewPort.bottom && elemDims.bottom > viewPort.top);
            },
            filterElem: function (item, index) {
                // This works because it can only be true if both "item" and "index" is a number
                if (parseInt(item, 10) === index) {
                    var elemDims = util.getElemDims(parallax.elems[item]);

                    if (parallax.elemIsInViewPort(elemDims)) {
                        this.elemsInViewPort.push(parallax.elems[item]);
                    }
                }
            },
            filterElems: function () {
                var thisObj = {
                    elemsInViewPort: []
                };

                Object.keys(parallax.elems).forEach(parallax.filterElem, thisObj);

                return thisObj.elemsInViewPort;
            },
            getElemsInViewPort: function () {
                util.getViewPort();

                var elemsInViewPort = parallax.filterElems();

                return $(elemsInViewPort);
            },
            getAreaHeight: function (elemDims) {
                var start = elemDims.top,
                    end = parseFloat(elemDims.bottom + viewPort.height),

                    areaHeight = Math.abs(start - end);

                return areaHeight;
            },
            getTranslateYPercent: function (elemDims, areaHeight) {
                var yPos = (viewPort.bottom - elemDims.top),

                    percentBase = 50,
                    percentPos = (yPos / areaHeight) * percentBase,
                    translateYPercent = parseFloat((percentBase - (percentBase * 2)) + percentPos);

                return translateYPercent;
            },
            translateY: function () {
                var elem = $(this),
                    elemDims = util.getElemDims(elem),
                    parallaxElem = elem.find("> div"),

                    areaHeight = parallax.getAreaHeight(elemDims),

                    translateYPercent = parallax.getTranslateYPercent(elemDims, areaHeight);

                parallaxElem.css("transform", "translateY(" + translateYPercent + "%)");
            },
            scroll: function () {
                var elemsInViewPort = parallax.getElemsInViewPort();

                elemsInViewPort.each(parallax.translateY);
            },
            bindEvents: function () {
                $(window).on("scroll resize", parallax.scroll);
            },
            init: function () {
                if (parallax.elems.length) {
                    parallax.scroll();

                    setTimeout(parallax.bindEvents, 0);
                }
            }
        };

    parallax.init();

}(window));
