const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../db/model");

if (process.env.NODE_ENV == "development") {
    callbackURL = "http://localhost:7000/auth/google/todos";
} else {
    callbackURL = "https://todos-by-ritwik.herokuapp.com/auth/google/todos";
}

module.exports = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:7000/auth/google/todos",
    },
    async function (accessToken, refreshToken, profile, cb) {
        oldUser = await User.findOne({ googleId: profile.id });
        if (oldUser) {
            return cb(null, oldUser);
        } else {
            let newUser;
            try {
                newUser = await User.create({
                    googleId: profile.id,
                    username: profile.emails[0].value,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                return cb(null, newUser);
            } catch (err) {
                return cb(err, newUser);
            }
        }
    }
);
