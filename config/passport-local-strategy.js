
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Assuming you have a User model

// Configure the local strategy for Passport
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });

            if (!user || user.password!=password) {
                return done(null, false, { message: 'Invalid username or password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize user to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // If the user is signed in, pass on the request to the next function (controller's action)
    if (req.isAuthenticated()) {
        return next();
    }
    // If the user is not signed in, redirect to the sign-in page
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signed-in user from the session cookie
        // Set the authenticated user in res.locals for use in views
        res.locals.user = req.user;
    }
    // Move on to the next middleware or route handler
    next();
};

module.exports = passport;
