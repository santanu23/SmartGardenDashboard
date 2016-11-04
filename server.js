// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser').json();
var Server = require('mongodb').Server;
var assert = require('assert');
var https = require('https');

var port = process.env.PORT || 8080; // set our port

var app = express(); // define our app using express

app.use(bodyParser);

var apiRouter = express.Router(); // get an instance of the express Router

var baseGetUrl = "https://P1942282309:9032822491Pp_@iotmmsp1942282309trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/app.svc/NEO_8IJ3RTA7M5XQSNIBTRTYHEOE5.T_IOT_EA1A61EDC8EA65791306?$format=json" +
                 "&$select=G_DEVICE,G_CREATED,C_TIMESTAMP,C_LIGHT,C_WATERLEVEL,C_MOISTURE,C_TEMPERATURE,C_DEVICEID";

var httpsCall = function(url, response){
    https.get(url, (res) => {
            res.on('data', (data) => {            
                response.writeHead(200, {
                    'Content-Type': 'text/json'
                });
                response.write(data);
                response.end();
          });

        }).on('error', (e) => {
          console.error(e);
    });
}

apiRouter.get('/', function(request, response) {
    console.log("GET HANA ALL");
    httpsCall(baseGetUrl, response);  
});

apiRouter.get('/lastReading', function(request, response) {
    console.log("GET HANA Last Read");
    var url = baseGetUrl + "&$orderby=G_CREATED desc&$top=1";
    httpsCall(url,response);
});

apiRouter.post('/', function(req, res) {
    console.log("HANA POST");
	var sensorValue = req.body.sensorValue;
	var sensorType = req.body.sensorType;
	var deviceName = req.body.deviceName;
    if (!sensorValue || !sensorType || !deviceName){
        res.status(500).json({message : 'Input parameters are null'});
        return;
    }
	var timestamp = new Date();
	var objectToStore = {"sensor":{"type":sensorType,"value":sensorValue},"deviceName": deviceName, "timestamp": timestamp};	
});

// REGISTER ROUTES
app.use('/', express.static(__dirname + '/home'));
app.use('/dashboard',express.static(__dirname + '/dashboard'));
app.use('/api', apiRouter);
// START THE SERVER

app.listen(port);
console.log('Listening on port ' + port);
