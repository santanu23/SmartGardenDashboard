(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    var url = "https://P1942282309:9032822491Pp_@iotmmsp1942282309trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/app.svc/NEO_8IJ3RTA7M5XQSNIBTRTYHEOE5.T_IOT_EA1A61EDC8EA65791306?$format=json"
    $.get(url, function(data, status){
    	var results = data.d.results;
    	for(var i = 0; i < results.length; i++){
    		colsole.log(results[i])
    	}
        Console.log("Status: " + status);
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space