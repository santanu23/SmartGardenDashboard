var apiUrl = window.location.origin + "/api";
var theta = 1;
function randomScalingFactor() {
	//return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
	return Math.sin(theta + Math.random()*0.5);
}

function	generatePureSin(){
	return Math.sin(theta);
}

function randomColorFactor() {
	return Math.round(Math.random() * 255);
}

function randomColor(opacity) {
	return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}

function newDate(days) {
	return moment().add(days, 's').toDate();
}

function newDateString(days) {
	return moment().add(days, 's').format();
}

function generateLabel(labelName) {
	return labelName.replace('_', ' ');
}

var config = {
	type: 'line',
	data: {
		labels: [newDate(0), newDate(1), newDate(2), newDate(3), newDate(4), newDate(5), newDate(6)], // Date Objects
		datasets: [{
			label: "My First dataset",
			data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
			fill: false,
			borderDash: [5, 5],
		}, {
			label: "My Second dataset",
			data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
		}, {
			label: "Dataset with point data",
			data: [{
				x: newDateString(0),
				y: randomScalingFactor()
			}, {
				x: newDateString(5),
				y: randomScalingFactor()
			}, {
				x: newDateString(7),
				y: randomScalingFactor()
			}, {
				x: newDateString(15),
				y: randomScalingFactor()
			}],
			fill: false
		}]
	},
	options: {
		responsive: true,
	    title:{
	        display:true,
	        text:"Chart.js Time Scale"
	    },
		scales: {
			xAxes: [{
				type: "time",
				scaleLabel: {
					display: true,
					labelString: 'Date'
				}
			}, ],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'value'
				}
			}]
		},
	}
};

(function($){
  $(function(){
    updateLastReadings();
    $('.button-collapse').sideNav();   
    $("#chart-container").text(""); 
	$("#chart-container").append("<canvas id=\"myChart\"width=\"200\" height=\"100\"></canvas>");
	var ctx = document.getElementById("myChart").getContext("2d");
	window.myLine = new Chart(ctx, config);		    
  }); // end of document ready
})(jQuery); // end of jQuery name space

queryHana = function(url, response){	
    $.get(url, function(data, status){
    	response = data.d.results;
    });
}

updateLastReadings = function(){
	$.get(apiUrl + "/lastReading", function(data, status){
		var lastReadings = data.d.results[0];
    	if (lastReadings){
	    	if(lastReadings.C_LIGHT){
	    		$('#w_lux').text(parseFloat(lastReadings.C_LIGHT));
	    	}
	    	if(lastReadings.C_WATERLEVEL){
	    		$('#w_water').text(parseFloat(lastReadings.C_WATERLEVEL));
	    	}
	    	if(lastReadings.C_MOISTURE){
	    		$('#w_mos').text(parseFloat(lastReadings.C_MOISTURE));
	    	}
	    	if(lastReadings.C_TEMPERATURE){
	    		$('#w_temp').text(parseFloat(lastReadings.C_TEMPERATURE));
	    	}
    	}
    });	
}