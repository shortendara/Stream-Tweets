var database = require('../database.js');
var Tweet = database.model('Tweet', {
	term : {type: String, required: true},
	username : {type: String, required: true},
	profile_pic : {type: String},
	text: {type :String, required: true},
	location: {type: String},
	coordinates: {type: Object},
	country_code: {type: String}
});

module.exports = Tweet;

module.exports.getTweetsByTerm = function(term, callback){
	var query = {term: term};
	Tweet.find(query, callback);
}