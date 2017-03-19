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
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

    let recentTweets;
    let friends;
    let messages;


    // Get 5 most recent tweets
    Twitter.get("statuses/user_timeline", twitOptions, function(error, data, response) {
        if(!error) {
            recentTweets = data;
        }

        // Get 5 Friends
        Twitter.get("friends/list", twitOptions, function(error, data, response) {
            if(!error) {
                friends = data.users;

                // TODO: Need to get profile image, real name, and screen name of each friend
            }

         // Get 5 most recent direct messages
        Twitter.get("direct_messages", {"count": 5}, function(error, data, response) {
            messages = data;
        }); // End direct message retrieval

        }); // End friends list request

        app.get("/", function(req, res) {
            console.log(messages);
            // console.log(friends);
            // console.log(recentTweets);
            res.render("index", {screenName: screenName});
        }); // end "/" request
    }); // End recent tweets request


app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});