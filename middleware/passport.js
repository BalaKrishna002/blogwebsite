const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt =require("bcrypt");

const User = require("../models/user");


passport.use(
  new LocalStrategy({usernameField: 'email'},async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      //console.log(user)
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      // Simple password comparison; do NOT use this in a real application
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        //req.flash("success", "Login successful!");
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

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://blogwebsite-0i6l.onrender.com/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.email
        });
        await user.save();
      }

      //console.log(profile);
      
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

  module.exports = passport;