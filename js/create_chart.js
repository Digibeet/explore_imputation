function create_chart(container, x_name, y_name, series){

    Highcharts.chart(container, {

        chart: {
            zoomType: 'xy',
        },

        title: {
            text: 'Missing Data Simulation Output'
        },

        xAxis: {
            title: {
                text: x_name
            }
        },

        yAxis: {
            //min: 0.6, I want to define min and max when a plot is loaded. But i also want users to be able to zoom!
            //max: 1.0,
            //tickInterval: 20,
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

        legend: {
        },

        credits: {
            enabled: false
        },

        series: series
    });
}