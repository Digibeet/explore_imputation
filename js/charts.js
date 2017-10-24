jQuery.get('data/results.txt', function(data) {

    lines = data.split("\n");
    var header = lines[0];
    lines.shift()
    columns = header.split("\t");

    header_map = {};
    columns.forEach(function (column, index) {
        header_map[column] = index;
    });

    data = {"MCAR":[], "MAR":[], "MNAR":[]};

    desired_columns = ["drop", "mean"]; // This needs to be interactive (start with just drop en mean, options: also median)
    desired_columns_indexes = []
    confidence_interval = true; // This needs to be interactive (true/false)

    for (index in desired_columns){
        column = desired_columns[index]
        column_index = header_map[column]
        desired_columns_indexes.push(column_index)

        if (confidence_interval){    
        desired_columns_indexes.push(parseInt(column_index) + parseInt(1)) //lower bound
        desired_columns_indexes.push(parseInt(column_index) + parseInt(2)) //upper bound
        }
    }

    x_column_index = header_map["missing_perc"];
    missing_type_index = header_map["missing_type"]
    evaluation_error_metric = 'MSE' //This needs to be interactive: RMSE, or MSE

    for(line_index in lines){
        line = lines[line_index]
        fields = line.split("\t")

        var missing_type = fields[missing_type_index]
        var desired_fields = {"x":fields[x_column_index]}

        for (index in desired_columns_indexes){
            column_index = desired_columns_indexes[index]
            column_name = columns[column_index]
            desired_fields[column_name] = fields[column_index]
        }

        if (data[missing_type]) {
            data[missing_type].push(desired_fields)
        } else {
            data[missing_type] = []
            data[missing_type].push(desired_fields)
        }  
    }

    desired_missing_type = "MCAR" // This needs to be interactive

    series = [];    

    Highcharts.setOptions({
        colors: ['#b2182b', '#1b7837', '#2166ac']
    });

    for (imputation_method_index in desired_columns) {
        imputation_method = desired_columns[imputation_method_index]
     
        var line_data = data[desired_missing_type].map(function(point, index) {
          return [parseFloat(point["x"]), parseFloat(point[imputation_method])];
        });

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

        if (confidence_interval){
            lower_bound_imputation_method = columns[parseInt(header_map[imputation_method]) + parseInt(1)]
            upper_bound_imputation_method = columns[parseInt(header_map[imputation_method]) + parseInt(2)]

            var range_data = data[desired_missing_type].map(function(point, index) {
                return [parseFloat(point["x"]), parseFloat(point[lower_bound_imputation_method]), parseFloat(point[upper_bound_imputation_method])];
            });

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
            text: 'MSE'
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

