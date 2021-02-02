const { User } = require("../db/model");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

function createNewUser(req, res, username, password, name, email) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
        User.create(
            {
                username: username,
                password: hash,
                name: name,
                email: email,
            },
            (err, user) => {
                if (err) {
                    console.log(err);
                }
                req.login(user, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    return res.redirect("/home/");
                });
            }
        );
    });
}

module.exports = {
    createNewUser,
};
