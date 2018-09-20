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
const ObjectID = require("mongodb").ObjectID;
const url = "mongodb://chris:chris6@ds163382.mlab.com:63382/todoapp2";

//Use Static Folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "node_modules")));


//Use EJS Template Engine
app.set("view engine", "ejs");

//Routes

//GET Index
app.get("/", (req, res, next) => {
  Todos.find({}).toArray((err, todos) => {
    if(err) {
      return console.log(err);
    }
    res.render("index", { todos : todos });
  });
});

//POST add todo
app.post("/todo/add", (req, res, next) => {
  const todo = {
    text: req.body.todoText,
    body: req.body.todoBody
  };
  //Insert todo to DB
  if (todo.text === "" || todo.body === "") {
    res.redirect("/");
  } else {
    Todos.insertOne(todo, (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.redirect("/");
    });
  }
});

//DELETE delete todo
app.delete("/todo/delete/:id", (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)};
  Todos.deleteOne(query, (err, response) => {
    if(err) {
      return console.log(err);
    }
    console.log("Todo Deleted");
    res.sendStatus(200);
  });
});

//GET edit todo form
app.get("/todo/edit/:id", (req, res, next) => {
  const query = { _id: ObjectID(req.params.id) };
  Todos.find(query).next((err, todo) => {
    if (err) {
      return console.log(err);
    }
    res.render("edit", { todo: todo });
  });
});

//POST edit todo
app.post("/todo/edit/:id", (req, res, next) => {
  const query = { _id: ObjectID(req.params.id) };
  const todo = {
    text: req.body.todoText,
    body: req.body.todoBody
  };

  Todos.updateOne(query, {$set:todo}, (err, todo) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
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