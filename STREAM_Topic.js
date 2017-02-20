/**
 *
 * Child process to query Twitter APi for required term. Data read from API is written to
 * database such that it can be served to users in future requests.
 */
var twit = require('twitter');
var express = require('express');
var app = new express();
//Twitter Credentials
var credentials = require('./twitter_credentials.js');
// Connection URL 
var url = 'mongodb://localhost:27017/myproject';

//Credentials for twitter API access
twitter = new twit({
	consumer_key : credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

/**
 *	Name: StreamTweets
 *
 *  Description: Function that streams tweets from twitter api. Tweets are filtered by
 *  either hashtag or by content of tweets. 
 *
 *  Paramaters: {term} is the hashtag or sentence to query API with.
 */
function StreamTweets(term){
	twitter.stream('statuses/filter', {track: term}, function(stream) {
		stream.on('data', function(event) {
			if(event.coordinates == null){
				//ParseTweet(event);
				console.log(event.text);
				console.log(event.user.location)
			}else{
				/*Write tweet to the database*/
				console.log(event.text)
				console.log(event.coordinates)
			}
		});

		stream.on('error', function(error) {
	    	console.log(error);
	  	});
	});
}


function ParseTweet(tweet){
	/**
		TODO:
		- Create Rabbit MQ connection
		- Send tweet to seperate service to try and locate tweet
	 */
	
}
/**
 *
 *  Name: "GET /tweets/stream"
 *
 *	Description: "Service to retrive latest tweets from Twitter when user enters search 
 *	term. This service is called if user wants to view live streaming of tweets"
 *
 *	Return: "Returns required Tweets in JSON format"
 */
app.get('/tweets/stream', function(req, res){
	console.log(req.query.id)
	StreamTweets(req.query.id);
});

app.listen(3000);