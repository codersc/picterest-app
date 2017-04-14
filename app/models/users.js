'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    twitter: {
        id: String,
        displayName: String
    }
});

User.statics.findOrCreate = function findOrCreate(profile, callback){
    var userObj = new this();
    
    this.findOne({ 'twitter.id' : profile.id }, function(err,result) { 
        if(!result) {
            userObj.twitter.id = profile.id;
            userObj.twitter.displayName = profile.displayName;
            
            userObj.save(callback);
        } else {
            callback(err,result);
        }
    });
};

module.exports = mongoose.model('User', User);