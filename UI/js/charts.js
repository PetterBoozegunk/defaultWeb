/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        charts = {
            elems: $(".chart"),
            set: function () {
                var t = $(this),
                    options = {
                        width: t.width(),
                        height: t.height(),
                        chart: {
                            type: "pie"
                        },
                        title: {
                            text: "De svenska årstiderna"
                        },
                        series: [{
                            type : "pie",
                            name: "Årstider",
                            tooltip: {
                                headerFormat: "",
                                footerFormat: "",
                                pointFormat: "<span style=\"color:{point.color}\">\u25CF</span> {point.name}: <b>{point.y}%</b>"
                            },
                            data: [{
                                y: 4,
                                name: "Vår",
                                color: "#12c33b"
                            }, {
                                y: 1,
                                name: "Sommar",
                                color: "#f6ea0b"
                            }, {
                                y: 15,
                                name: "Höst",
                                color: "#ef9635"
                            }, {
                                y: 80,
                                name: "Vinter",
                                color: "#d1ebf5"
                            }]
                        }]
                    },
                    chart = t.highcharts(options);

                console.log(chart);
            },
            init: function () {
                if (charts.elems.length) {
                    charts.elems.each(charts.set);
                }
            }
        };

    charts.init();

}(window));
