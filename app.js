const express = require("express");
const path = require("path");
const mongodb = require("mongodb");
const app = express();
const port = process.env.PORT || '3000';

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Use Public and Views Static Folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

//Use EJS Template Engine
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

//Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});