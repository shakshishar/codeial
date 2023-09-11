const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env=require('./environment');
// Tell passport to use a new strategy for Google login
passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret:env.google_client_secret,
      callbackURL:env.google_call_back_url,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Find a user
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If found, set this user as req.user
          return done(null, user);
        } else {
          // If not found, create the user and set it as req.user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex'),
          });
          
          return done(null, newUser);
        }
      } catch (err) {
        console.log('Error in Google strategy-passport', err);
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
