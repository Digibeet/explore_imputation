lines = []

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

    desired_columns = ["mean", "median","drop"];
    desired_columns_indexes = []
    for (column_index in desired_columns){
        column = desired_columns[column_index]
        desired_columns_indexes.push(header_map[column])
    }

    x_column_index = header_map["missing_perc"];

    for(line_index in lines){
        line = lines[line_index]

        fields = line.split("\t")

        missing_type_index = header_map["missing_type"]

        var missing_type = fields[missing_type_index]

        var desired_fields = {"x":fields[x_column_index]}
        for (index in desired_columns_indexes){
            desired_fields[desired_columns[index]] = fields[desired_columns_indexes[index]]
        }

        if(data[missing_type]) {
            data[missing_type].push(desired_fields)
        } else {
            data[missing_type] = []
            data[missing_type].push(desired_fields)
        }  
    }

    series = [];

    missing_type = "MCAR"

    for (imputation_method_index in desired_columns) {
        imputation_method = desired_columns[imputation_method_index]
        
        var line_data = data[missing_type].map(function(point, index) {
          return [parseFloat(point["x"]), parseFloat(point[imputation_method])];
        });

        console.log(line_data)

        line = {
            name: imputation_method,
            data: line_data,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }
        series.push(line)
    }

    console.log(data["MCAR"])

    Highcharts.chart('container', {

    title: {
        text: 'July temperatures'
    },

    xAxis: {
    },

    yAxis: {
        title: {
            text: null
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C'
    },

    legend: {
    },

    series: series
    });
});

