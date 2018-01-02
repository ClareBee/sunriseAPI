use mydb;
db.dropDatabase();

var mytable = [
  {
    place: "Giggleswick",
    day: "Tuesday January 2nd 2018",
    sunrise: "8:27:55 AM",
    sunset: "3:58:55 PM",
    lat: "54.0701268",
    lng: "-2.2900869000000057"
  }
];

db.mytable.insertMany(mytable);
db.mytable.find();
