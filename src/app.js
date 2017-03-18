'use strict';
const express = require("express");
const config = require("./config.js");

let app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get("/", function(req, res) {
    res.send("Welcome to the test page");
});


app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});