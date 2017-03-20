'use strict';
const express = require("express");
const Twit = require("twit");
const bodyParser = require("body-parser");
const config = require("./config.js");

let Twitter = new Twit(config);

const twitOptions = {
    "screen_name": "ENTER TWITTER SCREENNAME",
    "count": 5
};

const screenName = "ENTER TWITTER SCREENNAME";

let app = express();
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {

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
        if (!error) {
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
                    console.log(error);
                }

                // Get 5 most recent direct messages
                Twitter.get("direct_messages", {"count": 5}, function (error, data, response) {
                    if (!error) {
                        messages = data;
                    } else {
                        console.log("error getting messages");
                    }

                    // Render page once all requests are complete
                    res.render("index",
                        {userAvatarURL: userAvatarURL,
                            screenName: screenName, userName: userName, userFriends: userFriends, backgroundImageURL: backgroundImageURL, tweets: recentTweets, friends: friends, messages: messages});

                }); // End direct message retrieval
            }); // End friend request
        }); // End status request
    }); // end lookup
}); // End get "/"


// Request for posting a tweet
app.post("/", function(req, res) {
    const tweetBody = req.body.message;
    console.log(tweetBody);

    Twitter.post("statuses/update", {status: tweetBody}, function(error, data, response) {
    if(!error) {
        console.log(data);
    } else {
        console.log("Tweet could not be posted");
        console.log(error);
    }

    // Reloads page. There's a delay due to how Twitter API is set up
    res.redirect("/");
    });
});

app.get("*", function(req, res) {
    res.send("Sorry, this page does not exist");
});



app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});