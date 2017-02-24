/**
 * Microservice to retrieve tweets from Twitter Stream API
 * 
 */
var twit = require('twitter');
var express = require('express');
var app = new express();
var credentials = require('./twitter_credentials.js'); 
var amqp = require('amqplib/callback_api')

//Credentials for twitter API access
twitter = new twit({
	consumer_key : credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

function StreamTweets(search_term){
	var stream_count = 0;
	twitter.stream('statuses/filter', {track: search_term}, function(stream) {
		stream.on('data', function(event) {
			//TODO Change tweet from Object into array with necessary values
			/*
			var tweet = [7]
				term : search_term,
				username : event.user.screen_name,
				profile_pic : event.user.profile_image_url,
				text : event.text,
				location : event.user.location,
				coordinates : event.coordinates
			*/
			QueueTweet(tweet);
		});

		stream.on('error', function(error) {
	    	console.log(error);
	  	});
	});
}

function QueueTweet(tweet){
	amqp.connect('amqp://localhost:5672', function(err, conn) {
  		conn.createChannel(function(err, ch) {
		    var q = 'hello';

		    ch.assertQueue(q, {durable: false});
		    // Note: on Node 6 Buffer.from(msg) should be used
		    ch.sendToQueue(q, new Buffer(tweet));
		    console.log(" [x] Sent %s", tweet);
  		});
  		setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
}

app.get('/tweets/stream', function(req, res){
	StreamTweets(req.query.id);
});

app.listen(3000);
