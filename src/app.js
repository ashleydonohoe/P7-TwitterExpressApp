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

            // Variables needed per tweet
                // Message content: text
                // Sender's profile image: user["profile_image_url"
                // User's profile image: user["profile_background_image_url_https"]
            // profileImageURL = recentTweets.user["profile_background_image_url_https"];
                // # of Retweets: retweet_count
                // # of likes: user["favorites_count"]
                // Date tweeted: user["created_at"]
        }

        // Get 5 Friends
        Twitter.get("friends/list", twitOptions, function(error, data, response) {
            if(!error) {
                friends = data.users;

                // TODO: Need to get profile image, real name, and screen name of each friend
                console.log(friends[0].profile_image_url);
                // Variables for each friend
                    //profile image: profile_image_url
                    // real name: name
                    // screen name: screen_name
            }

         // Get 5 most recent direct messages
        Twitter.get("direct_messages", {"count": 5}, function(error, data, response) {
            if(!error) {
                messages = data;
                // Message variables needed for each message
                    // Sender's profile image: sender[profile_image_url]
                    // Message body: text
                    // Date sent: sender["created_at"]
            }

        }); // End direct message retrieval

        }); // End friends list request

        app.get("/", function(req, res) {
            console.log(messages[0].text);
            // console.log(friends);
            // console.log(recentTweets);
            res.render("index", {screenName: screenName, tweets: recentTweets, friends: friends, messages: messages});
        }); // end "/" request
    }); // End recent tweets request


app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});