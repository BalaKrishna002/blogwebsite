const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt =require("bcrypt");
const session = require("express-session");

const User = require("../models/user");


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        // Simple password comparison; do NOT use this in a real application
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    try {
      done(null, user.id);
    } catch (error) {
      done(error);
    }
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  module.exports = passport;