use mydb;
db.dropDatabase();

var mytable = [
  {
    name: "testing"
  },
  {
    name: "testing2"
  }
];

db.mytable.insertMany(mytable);
db.mytable.find();
