const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const googleStrategy = require("./passportGoogle");
const { User } = require("../db/model");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username.trim() }, async function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (user) {
                if (user.password) {
                    await bcrypt.compare(
                        password,
                        user.password,
                        function (err, result) {
                            if (result == false) {
                                return done(null, false, {
                                    message: "Incorrect password.",
                                });
                            } else {
                                return done(null, user);
                            }
                        }
                    );
                } else {
                    return done(null, false, {
                        message:
                            "You SignedUp using Google Account.Please signin in using that.",
                    });
                }
            }
        });
    })
);

passport.use(googleStrategy);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;
