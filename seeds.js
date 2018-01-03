use mydb;
db.dropDatabase();

var places = [
  {
    name: "Your favourite places appear here",
    lat: "123",
    lng: "345"
  }
];

db.places.insertMany(places);
db.places.find();
