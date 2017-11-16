function create_chart(container, x_name, y_name, series){

    Highcharts.chart(container, {

        title: {
            text: 'Missing Data Simulation Output'
        },

        xAxis: {
            title: {
                text: x_name
            }
        },

        yAxis: {
            title: {
                text: y_name
            }
        },

        tooltip: {
            crosshairs: false,
            shared: true,
            valuePrefix: '',
            valueSuffix: '',
            valueDecimals: 3,
        },

        chart: {
            zoomType: 'xy',
        },

        legend: {
        },

        credits: {
            enabled: false
        },

        series: series
    });
}