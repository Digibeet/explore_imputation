jQuery.get('data/results.txt', function(data) {

    lines = data.split("\n");
    var header = lines[0];
    lines.shift()
    column_names = header.split("\t");

    header_map = {};
    column_names.forEach(function (column, index) {
        header_map[column] = index;
    });

    // Default settings
    x_variable = 'missing_perc'
    missing_type = 'MAR'
    evaluation_error_metric = 'RMSE'
    evaluation_model = 'lin'
    desired_columns = ['drop', 'median']
    confidence_interval = true

    x_variable_index = header_map[x_variable];
    missing_type_index = header_map['missing_type'];
    evaluation_model_index = header_map['model']

    desired_columns_indexes = []
    for (index in desired_columns){
        column = desired_columns[index]
        column_index = header_map[column]
        desired_columns_indexes.push(column_index)

        if (confidence_interval) {    
        desired_columns_indexes.push(parseInt(column_index) + parseInt(1)) //lower bound
        desired_columns_indexes.push(parseInt(column_index) + parseInt(2)) //upper bound
        }
    }

    plot_data = [];
    for (line_index in lines) {
        line = lines[line_index]
        fields = line.split("\t")

        if (fields[missing_type_index] == missing_type) {
            if (fields[evaluation_model_index] == evaluation_model) {

                var desired_fields = {"x":fields[x_variable_index]}

                for (index in desired_columns_indexes){
                    column_index = desired_columns_indexes[index]
                    column_name = column_names[column_index]
                    desired_fields[column_name] = fields[column_index]
                }

                plot_data.push(desired_fields)
            }
        }
    }

    lines_data = [];
    ranges_data = [];

    if (evaluation_error_metric == 'RMSE') {

        for (imputation_method_index in desired_columns) {
            imputation_method = desired_columns[imputation_method_index]
     
            var one_line = plot_data.map(function(point, index) {
            return [parseFloat(point["x"]), Math.sqrt(parseFloat(point[imputation_method]))];
            });

            lines_data.push(one_line)

            if (confidence_interval) {

                lower_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(1)]
                upper_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(2)]

                var one_range = plot_data.map(function(point, index) {
                    return [parseFloat(point["x"]), Math.sqrt(parseFloat(point[lower_bound_imputation_method])), Math.sqrt(parseFloat(point[upper_bound_imputation_method]))];
                });

                ranges_data.push(one_range)
                var y_axis_name = "RMSE"
            }
        }
    } else {

        for (imputation_method_index in desired_columns) {
            imputation_method = desired_columns[imputation_method_index]
     
            var one_line = plot_data.map(function(point, index) {
                return [parseFloat(point["x"]), parseFloat(point[imputation_method])];
            });

            lines_data.push(one_line)

            if (confidence_interval) {

                lower_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(1)]
                upper_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(2)]

                var one_range = plot_data.map(function(point, index) {
                    return [parseFloat(point["x"]), parseFloat(point[lower_bound_imputation_method]), parseFloat(point[upper_bound_imputation_method])];
                });

                ranges_data.push(one_range)
                var y_axis_name = "MSE"
            }
        }
    }

    // Set up plot
    series = [];    
    Highcharts.setOptions({
        colors: ['#b2182b', '#1b7837', '#2166ac']
    });

    for (imputation_method_index in desired_columns) {

        imputation_method = desired_columns[imputation_method_index]
        line_data = lines_data[imputation_method_index]

        line = {
            name: imputation_method,
            data: line_data,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                radius: 3,
                lineColor: Highcharts.getOptions().colors[imputation_method_index]
            }
        }

        series.push(line)

        if (confidence_interval) {

            range_data = ranges_data[imputation_method_index]
            var range = "ci range ";

            range = {
                name: range.concat(imputation_method),
                data: range_data,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[imputation_method_index],
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }

            series.push(range)

        }

    }

    // Create plot
    Highcharts.chart('container', {

    title: {
        text: 'Missing Data Simulation Output'
    },

    xAxis: {
        tickInterval: 0.05,
        softMin: 0.04,
        softMax: 0.26,
        labels: {
            x: 0,
            y: 25,
            zIndex: 7
        }
    },

    yAxis: {
        title: {
            text: y_axis_name
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C'
    },

    legend: {
    },

    credits: {
        enabled: false
    },

    series: series
    });
});

