const express = require("express");
const path = require("path");
const mongodb = require("mongodb");
const app = express();
const port = process.env.PORT || '3000';

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setup MongoDB
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://chris:chris6@ds163382.mlab.com:63382/todoapp2";

//Use Public and Views Static Folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

//Use EJS Template Engine
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
  Todos.find({}).toArray((err, todos) => {
    if(err) {
      return console.log(err);
    }
    res.render("index", { todos : todos });
  });
});

//Connect to MongoDB
MongoClient.connect(url, (err, database) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected to DB");

  const db = database.db("todoapp2");
  Todos = db.collection("todos");

  //Start Server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});