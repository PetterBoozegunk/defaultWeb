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
            },
            isInViewPort: function (parallaxElems) {
                var elemDims = util.getElemDims(parallaxElems);

                return (elemDims.top < viewPort.bottom && elemDims.bottom > viewPort.top);
            }
        },

        parallax = {
            elems: $(".parallax"),

            filterElem: function (item, index) {
                // This works because it can only be true if both "item" and "index" is a number
                if (parseInt(item, 10) === index && util.isInViewPort(parallax.elems[item])) {
                    this.elemsInViewPort.push(parallax.elems[item]);
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
            getDims: function (elemDims) {
                var start = elemDims.top,
                    end = parseFloat(elemDims.bottom + viewPort.height);

                return {
                    yPos: Math.abs(start - end),
                    areaHeight: (viewPort.bottom - elemDims.top)
                };
            },
            calcPercentPos: function (parallaxDims, percentBase) {
                return (parallaxDims.yPos / parallaxDims.areaHeight) * percentBase;
            },
            calcNegativePercent: function (percentBase, percentPos) {
                return parseFloat((percentBase - (percentBase * 2)) + percentPos);
            },
            getTranslateYPercent: function (parallaxDims) {
                var percentBase = 50,

                    percentPos = parallax.calcPercentPos(parallaxDims, percentBase),
                    translateYPercent = parallax.calcNegativePercent(percentBase, percentPos);

                return translateYPercent;
            },
            translateY: function () {
                var elem = $(this),
                    elemDims = util.getElemDims(elem),

                    parallaxDims = parallax.getDims(elemDims),
                    translatePercent = parallax.getTranslateYPercent(parallaxDims),

                    parallaxElem = elem.find("> div");

                parallaxElem.css("transform", "translateY(" + translatePercent + "%)");
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
