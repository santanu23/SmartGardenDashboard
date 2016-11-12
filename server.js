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

var baseGetUrl = "https://api.thingspeak.com/channels.json?api_key=130XDIIHOZ65W7Q6";

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
    url = "https://api.thingspeak.com/channels/179370/feed.json?api_key=43JJR329XJJ5WU5I"
    httpsCall(url, response);  
});

apiRouter.get('/lastReading', function(request, response) {
    console.log("GET Last Read");
    var url = "https://api.thingspeak.com/channels/179370/feed/last.json?api_key=43JJR329XJJ5WU5I";
    httpsCall(url,response);
});

// REGISTER ROUTES
app.use('/', express.static(__dirname + '/home'));
app.use('/dashboard',express.static(__dirname + '/dashboard'));
app.use('/api', apiRouter);
// START THE SERVER

app.listen(port);
console.log('Listening on port ' + port);
