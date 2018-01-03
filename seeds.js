use mydb;
db.dropDatabase();

var places = [
  {
    name: "Your favourite places appear here",
    latitude: "123",
    longitude: "345"
  }
];

db.places.insertMany(places);
db.places.find();
