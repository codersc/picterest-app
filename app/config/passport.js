'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        function(token, tokernSecret, profile, cb) {
            User.findOrCreate(profile, function(err, user) {
                return cb(err, user);
            });            
        }
    ));
};