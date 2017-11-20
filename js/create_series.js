function create_series(data, desired_columns, missing_type, evaluation_metric, evaluation_model, x_variable) {
    lines = data.split("\n");
    var header = lines[0];
    lines.shift()
    column_names = header.split("\t");

    header_map = {};
    column_names.forEach(function(column, index) {
        header_map[column] = index;
    });
    console.log(header_map)

    //Find where the desired data is stored in the matrix
    desired_columns_indexes = []
    for (index in desired_columns){
        column = desired_columns[index]
        column_index = header_map[column]
        desired_columns_indexes.push(column_index)

        if (confidence_interval) {
        desired_columns_indexes.push(parseInt(column_index) + 1) //lower bound
        desired_columns_indexes.push(parseInt(column_index) + 2) //upper bound
        }
    }

    plot_data = [];
    for (line_index in lines) {
        line = lines[line_index]
        fields = line.split("\t")

        if (fields[header_map['missing_type']] == missing_type) {
            if (fields[header_map['evaluation_metric']] == evaluation_metric) {
                if (fields[header_map['model']] == evaluation_model) {
                    var desired_fields = {"x":fields[header_map[x_variable]]} //dit gaat mis als x_variable is: missing_cells_proportion
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

    series = [];

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

    y_min = 0.1 // I want to define y_min en y_max here, and give it to create_chart
    y_max = 1.0

    return {
        series: series,
        y_axis_name: y_axis_name,
        y_min: y_min,
        y_max: y_max,
    };
}