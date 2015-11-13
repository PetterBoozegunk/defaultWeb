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

            filterElem: function (item, index) {
                // This works because it can only be true if both "item" and "index" is a number
                if (parseInt(item, 10) === index) {
                    var elemDims = util.getElemDims(parallax.elems[item]);

                    if (elemDims.top < viewPort.bottom && elemDims.bottom > viewPort.top) {
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
            translateY: function () {
                var elem = $(this),
                    elemDims = util.getElemDims(elem),
                    parallaxElem = elem.find("> div"),

                    start = elemDims.top,
                    end = parseFloat(elemDims.bottom + viewPort.height),

                    areaHeight = Math.abs(start - end),

                    yPos = (viewPort.bottom - elemDims.top),

                    percentBase = 50,
                    percentPos = (yPos / areaHeight) * percentBase,
                    negativePercent = parseFloat((percentBase - (percentBase * 2)) + percentPos);

                parallaxElem.css("transform", "translateY(" + negativePercent + "%)");
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
