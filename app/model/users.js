'use strict';
var findOrCreate = require('mongoose-findorcreate');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	user: {
		id: String,
		name: String
	},
   yelp: {
      id: String , //The id of shop/resterant/...
      name:String
   }
});
User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);
