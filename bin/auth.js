var express = require('express'),
	router = express.Router(),
	actions = require('./actions'),
	passport = require('passport'),
	localStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  actions.getUserById(id, function(user) {
  	done(null, user);
  });
});
passport.use(new localStrategy(
	function(username, password, done) {
		actions.getUserByUsername(username, function(user) {
			if(!user) {
				error = 'Incorrect username/password';
				return done(null, false);
			} else {
				actions.comparePassword(password, user.password, function(isMatch) {
					if (isMatch) {
						error = undefined;
						return done(null, user);
					} else {
						error = 'Incorrect username/password';
						return done(null, false);
					}
				});
			}
		});
	}
));
module.exports = passport;
