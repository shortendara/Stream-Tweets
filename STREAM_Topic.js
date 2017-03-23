/**
 * Microservice to retrieve tweets from Twitter Stream API
 * 
 */
var twit = require('twitter');
var express = require('express');
var app = new express();
var credentials = require('./twitter_credentials.js');
var Tweet = require("./models/tweet")

//Credentials for twitter API access
twitter = new twit({
	consumer_key : credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

function StreamTweets(search_term){
	twitter.stream('statuses/filter', {track: search_term}, function(stream) {
		stream.on('data', function(event) {
			//TODO Change tweet from Object into array with necessary values
			var tweet = new Tweet({
				term : search_term,
				username : event.user.screen_name,
				profile_pic : event.user.profile_image_url,
				text : event.text,
				location : event.user.location,
				coordinates : event.coordinates
			});
			tweet.save();
		});
		stream.on('error', function(error) {
	    	console.log(error);
	  	});
	});
}

app.get('/tweets/stream', function(req, res){
	res.send(StreamTweets(req.query.id));
});

app.listen(3000);
