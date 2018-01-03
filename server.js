var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("client/build"));
var ObjectId = require("mongodb").ObjectId;

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017/mydb", function(err, client){
  if(err){
    return console.log(err);
  }
  db = client.db("mydb");
  console.log("Connected to DB");
  app.listen(3000, function () {
  console.log("App running on port " + this.address().port);
});
});

//join method allows us to chain variables to make a path, avoiding issues with different operating systems treating slashes differently
//__dirname is a native Node variable which contains the file path of the current folder
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + 'client/build/index.html'));
});

app.get("/places", function(req, res){
  db.collection("places").find().toArray(function(err, results){
    if(err){
      return console.log(err);
    }
    res.json(results);
  });
});

app.post("/places", function(req, res){
  db.collection("places").save(req.body, function(err, result){
    if(err){
      return console.log(err);
    }
    console.log("saved to database");
    res.redirect("/");
  });
});

// app.post("/delete", function(req, res){
//   db.collection("places").remove();
//   res.redirect("/");
// });

app.post("/places/:id/delete", function(req, res){
  var id = new ObjectId(req.params.id);
  db.collection("places").remove({_id: id});
  res.redirect("/");
});
