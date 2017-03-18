'use strict';
const express = require("express");
const Twit = require("twit");
const bodyParser = require("body-parser");
const config = require("./config.js");

let Twitter = new Twit(config);
const twitOptions = {
    "screen_name": "GS_HelloKitty",
    "count": 5
};
const screenName = "GS_HelloKitty";

let app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get("/", function(req, res) {

    // Get 5 most recent tweets
    Twitter.get("statuses/user_timeline", twitOptions, function(error, data, response) {
        if(!error) {
            let recentTweets = data;
        }

        // Get 5 Friends
        Twitter.get("friends/list", twitOptions, function(error, data, response) {
            if(!error) {
                let friends = data.users;

                // TODO: Need to get profile image, real name, and screen name of each friend
            }

         // Get 5 most recent direct messages
        Twitter.get("direct_messages", {"count": 5}, function(error, data, response) {
            let messages = data;
        }); // End direct message retrieval

        }); // End friends list request
    }); // End recent tweets request

    res.send("Done");


});


app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});