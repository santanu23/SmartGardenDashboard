// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser').json();
var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var assert = require('assert');

var port = process.env.PORT || 8080; // set our port

var app = express(); // define our app using express

app.use(bodyParser);

var apiRouter = express.Router(); // get an instance of the express Router
apiRouter.get('/', function(req, res) {
	var mongoClient = new MongoClient(new Server('localhost', 27017));
    mongoClient.open(function(err, mongoClient) {
        if(err){
            console.log(err);
            res.status(500).json({message : 'Error connection to the database'});
        }else{
            var db = mongoClient.db("sensorData");
            var collectionInfo = db.collection("collection");
            // Here we will find all students
            collectionInfo.find({}).toArray(function(err, students) {
               // so now, we can return all students to the screen.
               res.status(200).json({'myCollection' : students});
            });
        }
    })
});

apiRouter.post('/', function(req, res) {
    console.log(req.headers);
    console.log(req.body);
	var sensorValue = req.body.sensorValue;
	var sensorType = req.body.sensorType;
	var deviceName = req.body.deviceName;
	var timestamp = new Date();
	var objectToStore = {"sensor":{"type":sensorType,"value":sensorValue},"deviceName": deviceName, "timestamp": timestamp};
	var mongoClient = new MongoClient(new Server('localhost', 27017));
    mongoClient.open(function(err, mongoClient) {
        if(err){
            console.log(err);
            res.status(500).json({message : 'Error connection to the database'});
        }else{
        	var db = mongoClient.db("sensorData");
            db.open(function(err, db) {
			  // Fetch a collection to insert document into
				var collection = db.collection("collection");
			  	// Insert a single document
				collection.insert(objectToStore,{}, function(err, result) {
    		    	assert.equal(null, err);
    		    	// Fetch the document
    		    	collection.findOne({'timestamp': timestamp}, function(err, item) {
    		      		assert.equal(null, err);
    		      		//assert.equal(sensorValue, item.sensorValue); TODO: FIX THIS 
    		      		db.close();
                        res.status(200).json({message : 'Successfully Inserted Data'});
    		    	})
			  	});
			});
        }
    })
});

// REGISTER ROUTES
app.use('/', express.static(__dirname + '/home'));
app.use('/dashboard',express.static(__dirname + '/dashboard'));
app.use('/api', apiRouter);
// START THE SERVER

app.listen(port);
console.log('Listening on port ' + port);
