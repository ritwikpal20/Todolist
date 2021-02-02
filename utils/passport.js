const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../db/model");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }, async function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (user) {
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
            }
        });
    })
);
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;
