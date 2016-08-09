/********************************INIT STUFF***************************************/

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LOCATION = "locations";

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var url = 'mongodb://localhost:27017/GEO_LOCATION'
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});//end of mongoclient

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/********************************END INIT STUFF***************************************/

/********************************CHARACTER***************************************/
  /***************ADD TO CHARACTER COLLECTION***********************/
  app.post("/locations", function(request, response){
   console.log("######### ADD TO LOCATIONS: APP.POST ###########");
   var newLocation = request.body;

   db.collection(LOCATION).insertOne(newLocation, function(err, doc) {
      console.log("in dbcollect");
       if (err) {
         console.log("there has been an error");
         handleError(response, err.message, "Failed to create new contact.");
       } else {
         response.status(201).json(doc.ops[0]);
         console.log("character has been added");
        }
     });
  })

  app.get('/locations', function(request, response){
    db.collection(LOCATION).find().toArray(function (err, result) {
      if (err) {
        console.log("ERROR!", err);
        response.json("error");
      } else if (result.length) {
        console.log('Found:', result);
        response.json(result);
      } else { //
        console.log('No document(s) found with defined "find" criteria');
        response.json("no unicorns found");
      }

    }); // end find
  }); // end app.get


  app.delete('/locations/:name', function(request, response) {
    console.log("1request.body:", request.body);
    console.log("2request.params:", request.params);
      db.collection(LOCATION).remove({name:request.params.name}, function(err, numOfRemovedDocs) {
        console.log("numOfRemovedDocs:", numOfRemovedDocs);
        if(err) {
          console.log("error!", err);
        } else { // after deletion, retrieve list of all
          db.collection(LOCATION).find().toArray(function (err, result) {
            if (err) {
              console.log("ERROR!", err);
              response.json("error");
            } else if (result.length) {
              console.log('Found:', result);
                response.json(result);
              } else { //
                  console.log('No document(s) found with defined "find" criteria');
                  response.json("none found");
                }

            }); // end find
          } // end else
        }); // end remove
    }); // end delete

    app.put('/locations/:name', function(request, response) {
      // response.json({"description":"update by name"});
      console.log("request.body", request.body);
      console.log("request.params:", request.params);

      var old = {name: request.body.name};
      var updateTo = request.body.comment;


        db.collection(LOCATION).update(old,{$set:{comment: updateTo}},function (err, result) {
          if (err) {
            console.log("ERROR!", err);
            response.json("error");
          } else if (result.length) {
            console.log('Found:', result);
            response.json(result);
          } else { //
            console.log('No document(s) found with defined "find" criteria');
            response.json("none found");
          }

        }); // end find
    }); // end update
