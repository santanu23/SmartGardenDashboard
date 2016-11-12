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
		labels: [], // Date Objects
		datasets: [{
			label: "Light",
			data: [],
			fill: false,
			borderColor: "rgba(222, 125, 24, 1)",

		}] 
	},
	options: {
		responsive: true,
	    title:{
	        display:false,
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
  	setInterval(updateLastReadings, 1000);
  	updateGraph();
    $('.button-collapse').sideNav();   
    $("#chart-container").text(""); 
	$("#chart-container").append("<canvas id=\"myChart\"width=\"200\" height=\"100\"></canvas>");
	var ctx = document.getElementById("myChart").getContext("2d");
	window.myLine = new Chart(ctx, config);		    
  }); // end of document ready
})(jQuery); // end of jQuery name space

updateGraph = function(){
	$.get(apiUrl + "/all", function(data, status){
		if (data){
			if (data.feeds){
				for(var i = 0; i < data.feeds.length; i++){
					//temp
					if(data.feeds[i].field1){
						var oldDataSet = myLine.config.data.datasets[0].data;
						var newData = {x:data.feeds[i].field1,y:parseFloat(data.feeds[i].field1).toFixed(2)};
						oldDataSet.push(newData); 
			    	}
			    	//light
			    	if(data.feeds[i].field2){			    		
			    	}
			    	if(data.feeds[i].field3){
			    	}
			    	if(data.feeds[i].field4){
			    	}
				}
				myLine.update();
			}   	    	
    	}
	});
}

updateLastReadings = function(){
	$.get(apiUrl + "/lastReading", function(data, status){
    	if (data){
    		//temp
	    	if(data.field1){
	    		$('#w_temp').text(parseFloat(data.field1).toFixed(2));
	    	}
	    	//light
	    	if(data.field2){
	    		$('#w_lux').text(parseFloat(data.field2).toFixed(2));
	    	}
	    	if(data.field3){
	    		$('#w_veg1').text(parseFloat(data.field3).toFixed(2));
	    	}
	    	if(data.field4){
	    		$('#w_veg2').text(parseFloat(data.field4).toFixed(2));
	    	}
    	}
    });	
}