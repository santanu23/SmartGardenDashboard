// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser').json();
var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var assert = require('assert');
var https = require('https');

var port = process.env.PORT || 8080; // set our port

var app = express(); // define our app using express

app.use(bodyParser);

var apiRouter = express.Router(); // get an instance of the express Router
apiRouter.get('/', function(req, res) {
    console.log("GET handler");
	var mongoClient = new MongoClient(new Server('localhost', 27017));
    mongoClient.open(function(err, mongoClient) {
        if(err){
            console.log(err);
            res.status(500).json({message : 'Error connection to the database'});
        }else{
            var db = mongoClient.db("sensorData");
            var collection = db.collection("collection");
            // Here we will find all students
            collection.find({}).toArray(function(err, students) {
               // so now, we can return all students to the screen.
               res.status(200).json({'data' : students});
            });
        }
    })
});

apiRouter.get('/hana/', function(req, res) {
    console.log("GET handler for HANA");
    var url = "https://P1942282309:9032822491Pp_@iotmmsp1942282309trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/app.svc/NEO_8IJ3RTA7M5XQSNIBTRTYHEOE5.T_IOT_EA1A61EDC8EA65791306?$format=json";
    https.get(url, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        process.stdout.write(d);
      });

    }).on('error', (e) => {
      console.error(e);
    });

});

apiRouter.post('/', function(req, res) {
    console.log("POST handler");
	var sensorValue = req.body.sensorValue;
	var sensorType = req.body.sensorType;
	var deviceName = req.body.deviceName;
    if (!sensorValue || !sensorType || !deviceName){
        res.status(500).json({message : 'Input parameters are null'});
        return;
    }
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
    		    	assert.equal(null, err); //make sure error is null
    		    	// Fetch the document
    		    	collection.findOne({'_id': result[0]._id}, function(err, item) {
    		      		assert.equal(null, err); //make sure error is null
    		      		assert.equal(deviceName, item.deviceName); //make sure the device names match
    		      		db.close();
                        res.status(200).json({message : 'Successfully Inserted', dataEntry : result});
    		    	})
			  	});
			});
        }
    })
});
//TODO: change all methods to be used with mongo 2.0
apiRouter.delete('/', function(req, res) {
    console.log("DELETE handler");
    var objectIDToDelete = req.body.objectID;
    if (!objectIDToDelete){
        res.status(500).json({message : 'objectID is null'});
        return;
    }
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
                collection.deleteOne( { "_id" : objectIDToDelete } ,{}, function(err, result) {
                    assert.equal(null, err); //make sure error is null
                    db.close();
                    res.status(200).json({message : 'Successfully Deleted', dataEntry : result});
                });
            });
        }
    });
});

// REGISTER ROUTES
app.use('/', express.static(__dirname + '/home'));
app.use('/dashboard',express.static(__dirname + '/dashboard'));
app.use('/api', apiRouter);
// START THE SERVER

app.listen(port);
console.log('Listening on port ' + port);
