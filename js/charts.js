data_set = 'data/results_custom_dataset_500_5.txt'
desired_columns = ['drop', 'mean', 'median', 'regression', 'random', 'stochastic']

// Default settings
x_variable = 'missing_rows_percentage' //dropdown with two choices: Proportion of incomplete rows, proportion of empty data cells
missing_type = 'MCAR' //Dropdown with three choices: MCAR, MAR, MNAR
evaluation_error_metric = 'RMSE' //Dropdown with choices MSE, RMSE and R2
evaluation_model = 'lin' //Currently no button needed

confidence_interval = false //Option with click yes or no

function generate_chart(){
    jQuery.get(data_set, function(data) {

        if ((evaluation_error_metric == 'RMSE') || (evaluation_error_metric == 'MSE')){
            evaluation_metric = 'mse'
        } else {
            evaluation_metric = 'ev'
        }

        Highcharts.setOptions({
        colors: ['#b2182b', '#1b7837', '#2166ac', '#756bb1', '#fa9fb5', '#f1a340']
        });

        series = create_series(data, desired_columns,missing_type, evaluation_metric, evaluation_model, x_variable)

        if (x_variable == 'missing_rows_percentage') {
            var x_axis_name = 'Proportion of incomplete rows'
        } else if (x_variable == 'missing_cells_percentage') {
            var x_axis_name = 'Proportion of missing data cells'
        }

        // Create plot
        create_chart('container', "dit is x", "dit is y", series);
    });
}

change_missing_type = function(new_type){
    missing_type = new_type;
    generate_chart();
}

window.onload = function() {
  generate_chart();
};