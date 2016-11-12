// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser').json();
var assert = require('assert');
var https = require('https');

var port = process.env.PORT || 8080; // set our port

var app = express(); // define our app using express

var apiWriteKey = 'YRREW6MQXXUEKJG3';
var apiReadKey = '43JJR329XJJ5WU5I';
var apiChannelKey = '130XDIIHOZ65W7Q6';

app.use(bodyParser);

var apiRouter = express.Router(); // get an instance of the express Router

var baseGetUrl = "https://api.thingspeak.com/channels/179370/feed";

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

apiRouter.get('/all', function(request, response) {
    console.log("GET ALL");
    var queryURL = baseGetUrl + ".json" + "?api_key=" + apiReadKey;
    httpsCall(queryURL, response);  
});

apiRouter.get('/lastReading', function(request, response) {
    console.log("GET Last Read");
    var queryURL = baseGetUrl + "/last.json" + "?api_key=" + apiReadKey;
    httpsCall(queryURL,response);
});

// REGISTER ROUTES
app.use('/', express.static(__dirname + '/dashboard'));
app.use('/api', apiRouter);
// START THE SERVER

app.listen(port);
console.log('Listening on port ' + port);
