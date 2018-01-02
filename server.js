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

});

app.get("/mytable", function(req, res){
  db.collection("mytable").find().toArray(function(err, result){
    if(err){
      return console.log(err);
    }
    res.json(results);
  });
});

//join method allows us to chain variables to make a path, avoiding issues with different operating systems treating slashes differently
//__dirname is a native Node variable which contains the file path of the current folder
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.use(express.static('public'));

var server = app.listen(3000, function(){
  console.log("App is listening at" + this.address().port);
});
