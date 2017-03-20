'use strict';
const express = require("express");
const Twit = require("twit");
const bodyParser = require("body-parser");
const config = require("./config.js");

let Twitter = new Twit(config);
const twitOptions = {
    "screen_name": "ashleydonohoe12",
    "count": 5
};

const screenName = "ashleydonohoe12";

let app = express();
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Variables for collecting info from the requests
    let recentTweets;
    let friends;
    let messages;
    let userName;
    let userFriends;
    let backgroundImageURL;
    let userAvatarURL;

    // Get user info
    Twitter.get("users/lookup", {screen_name: screenName}, function(error, data, response) {
        if(!error) {
            userName = data[0].name;
            userFriends = data[0].friends_count;
            backgroundImageURL = data[0].profile_background_image_url;
            userAvatarURL = data[0].profile_image_url;
        } else {
            console.log("Error getting user info");
        }

    // Get 5 most recent tweets
    Twitter.get("statuses/user_timeline", twitOptions, function(error, data, response) {
        if (!error) {
            recentTweets = data;
        } else {
            console.log("Error getting tweets");
        }

        // Get 5 Friends
        Twitter.get("friends/list", twitOptions, function (error, data, response) {
            if (!error) {
                friends = data.users;
            } else {
                console.log("Error getting friends");
            }

            // Get 5 most recent direct messages
            Twitter.get("direct_messages", {"count": 5}, function (error, data, response) {
                if (!error) {
                    messages = data;
                } else {
                    console.log("error getting messages");
                }
            }); // End direct message retrieval
        }); // End friends list request
    }); // end recent tweets request

        app.get("/", function(req, res) {
            res.render("index",
                {userAvatarURL: userAvatarURL,
                    screenName: screenName, userName: userName, userFriends: userFriends, backgroundImageURL: backgroundImageURL, tweets: recentTweets, friends: friends, messages: messages});
        }); // end "/" request
    }); // End initial user profile lookup



// Request for posting a tweet
app.post("/", function(req, res) {
    const tweetBody = req.body.message;
    console.log(tweetBody);
});


app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});