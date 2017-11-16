jQuery.get('data/results_forest_fires.txt', function(data) {

    lines = data.split("\n");
    var header = lines[0];
    lines.shift()
    column_names = header.split("\t");

    header_map = {};
    column_names.forEach(function(column, index) {
        header_map[column] = index;
    });
    console.log(header_map)

    // Default settings
    x_variable = 'missing_rows_proportion' //dropdown with two choices: Proportion of incomplete rows, proportion of empty data cells
    missing_type = 'MAR' //Dropdown with three choices: MCAR, MAR, MNAR
    evaluation_error_metric = 'MSE' //Dropdown with choices MSE, RMSE and R2
    evaluation_model = 'lin' //Currently no button needed
    desired_columns = ['drop', 'mean', 'median', 'regression', 'random', 'stochastic'] //Clickbutton with three options (drop, mean, median), clicked methods should be stored in this variable
    confidence_interval = false //Option with click yes or no

    x_variable_index = header_map[x_variable]; //doesn't work with 'missing_cells_percentage', why not? 
    missing_type_index = header_map['missing_type'];
    evaluation_model_index = header_map['model'];
    evaluation_metric_index = header_map['evaluation_metric'];

    if ((evaluation_error_metric == 'RMSE') || (evaluation_error_metric == 'MSE')){
        evaluation_metric = 'mse'
    } else {
        evaluation_metric = 'ev'
    }

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
            //console.log(fields)
            if (fields[evaluation_metric_index] == evaluation_metric) {
                //console.log(fields)
                if (fields[evaluation_model_index] == evaluation_model) {
                    //console.log(fields)
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
                
            }
        }

        var y_axis_name = "RMSE"

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
            }
        }

        if (evaluation_error_metric == 'MSE') {

            var y_axis_name = "MSE"

        } else if (evaluation_error_metric == 'R2') {

            var y_axis_name = "R2"
        
        }
    } 

    // Set up plot
    series = [];    
    Highcharts.setOptions({
        colors: ['#b2182b', '#1b7837', '#2166ac', '#756bb1', '#fa9fb5', '#f1a340']
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

    if (x_variable == 'missing_rows_proportion') {
        var x_axis_name = 'Proportion of incomplete rows'
    } else if (x_variable == 'missing_cells_proportion') {
        var x_axis_name = 'Proportion of missing data cells'
    }

    // Create plot
    Highcharts.chart('container', {

    title: {
        text: 'Missing Data Simulation Output'
    },

    xAxis: {
        title: {
            text: x_axis_name
        }
    },

    yAxis: {
        title: {
            text: y_axis_name
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
});

