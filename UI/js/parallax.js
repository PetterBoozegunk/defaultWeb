/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,

        viewPort = {
            top: 0,
            height: 0,
            bottom: 0
        },

        areaHeightsCache = {},
        translateYPercentCache = {},

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
            calcAreaHeight: function (etop, eBottom, vpHeight) {
                var start = etop,
                    end = parseFloat(eBottom + vpHeight),
                    areaHeight = Math.abs(start - end),

                    cacheName = etop + ":" + eBottom + ":" + vpHeight;

                areaHeightsCache[cacheName] = areaHeight;

                return areaHeight;
            },
            getAreaHeight: function (etop, eBottom, vpHeight) {
                var cacheName = etop + ":" + eBottom + ":" + vpHeight,
                    areaHeight = areaHeightsCache[cacheName] || parallax.calcAreaHeight(etop, eBottom, vpHeight);

                return areaHeight;
            },
            calcTranslateYPercent: function (vpBottom, eTop, aHeight) {
                var yPos = (vpBottom - eTop),

                    percentBase = 50,
                    percentPos = (yPos / aHeight) * percentBase,
                    translateYPercent = parseFloat((percentBase - (percentBase * 2)) + percentPos);

                translateYPercentCache[vpBottom + ":" + eTop + ":" + aHeight] = translateYPercent;

                return translateYPercent;
            },
            getTranslateYPercent: function (vpBottom, eTop, aHeight) {
                var cacheName = vpBottom + ":" + eTop + ":" + aHeight,
                    translateYPercent = translateYPercentCache[cacheName] || parallax.calcTranslateYPercent(vpBottom, eTop, aHeight);

                return translateYPercent;
            },
            translateY: function () {
                var elem = $(this),
                    elemDims = util.getElemDims(elem),
                    parallaxElem = elem.find("> div"),

                    areaHeight = parallax.getAreaHeight(elemDims.top, elemDims.bottom, viewPort.height),

                    translateYPercent = parallax.getTranslateYPercent(viewPort.bottom, elemDims.top, areaHeight);

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

                    window.console.log("areaHeightsCache = ", areaHeightsCache);
                    window.console.log("translateYPercentCache = ", translateYPercentCache);

                    parallax.scroll();

                    setTimeout(parallax.bindEvents, 0);
                }
            }
        };

    parallax.init();

}(window));
