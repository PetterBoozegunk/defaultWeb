/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        google = window.google,
        charts = {
            elems: $(".googleChart"),
            addColumns: function (columns, chartData) {
                columns.forEach(function (item) {
                    chartData.addColumn(item[0], item[1]);
                });
            },
            getData: function (data) {
                var chartData = new google.visualization.DataTable();

                charts.addColumns(data.columns, chartData);

                chartData.addRows(data.rows);

                return chartData;
            },
            set: function () {
                var elem = this,
                    json = $.parseJSON(elem.getAttribute("data-chart")),

                    data = charts.getData(json.data),
                    options = json.options,

                    chart = new google.visualization.PieChart(elem);

                chart.draw(data, options);
            },
            setAll: function () {
                charts.elems.each(charts.set);
            },
            init: function () {
                google.load("visualization", "1.0", {
                    "packages": ["corechart"]
                });

                google.setOnLoadCallback(charts.setAll);
            },
            check: function () {
                if (charts.elems.length) {
                    charts.init();
                }
            }
        };

    charts.check();

}(window));
