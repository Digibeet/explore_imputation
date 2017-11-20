// Default settings
data_set = 'data/results_custom_dataset_poor_large.txt'
desired_columns = ['drop', 'mean', 'median', 'regression', 'random', 'stochastic']
x_variable = 'missing_rows_proportion'
missing_type = 'MCAR'
evaluation_error_metric = 'R2'
evaluation_model = 'lin'
confidence_interval = true

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

        series = create_series(data, desired_columns, missing_type, evaluation_metric, evaluation_model, x_variable)

        if (x_variable == 'missing_rows_proportion') {
            var x_axis_name = 'Proportion of incomplete rows'
        } else if (x_variable == 'missing_cells_proportion') {
            var x_axis_name = 'Proportion of missing data cells'
        }

        // Create plot
        // I want to give series.y_min and series.y_max to create_chart
        create_chart('container', x_axis_name, series.y_axis_name, series.series);
   });
}

change_missing_type = function(new_type){
    missing_type = new_type;
    generate_chart();
}

change_evaluation_error_metric = function(new_evaluation_error_metric){
    evaluation_error_metric = new_evaluation_error_metric;
    generate_chart();
}

change_x_variable = function(new_x_variable){
    x_variable = new_x_variable;
    generate_chart();
}

change_confidence_interval = function(new_confidence_interval){
    confidence_interval = new_confidence_interval == 'True';
    generate_chart();
}

change_data_set = function(name){
    data_set = 'data/results_' + name + '.txt'
    generate_chart();
}

/*
change_data_set = function(new_correlation_structure, new_amount_noise){
    data_set = 'data/results_custom_dataset_' + new_correlation_structure + '_' + new_amount_noise + '.txt'
    generate_chart();
}*/

window.onload = function() {
  generate_chart();
};