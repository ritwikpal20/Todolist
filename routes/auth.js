const { Router } = require("express");
const { User } = require("../db/model");
const { createNewUser } = require("../controllers/users");
const passport = require("../utils/passport");
const route = Router();

route.get("/signup", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/home");
    } else {
        // req.flash() becomes null after calling the function once , therefore we need to store it in a variable before making further calculations which require req.flash()
        errorsAndPreviousValues = req.flash();
        flash_length = Object.keys(errorsAndPreviousValues).length;
        if (flash_length > 0) {
            res.render("signup", {
                title: "Sign Up | Todos",
                errorsAndPreviousValues,
                isAuthenticated: false,
            });
        } else {
            res.render("signup", {
                title: "Sign Up | Todos",
                errorsAndPreviousValues: {
                    nameValue: [""],
                    usernameValue: [""],
                    emailValue: [""],
                },
                isAuthenticated: false,
            });
        }
    }
});
route.post("/signup", async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const name = req.body.name.trim();
    const email = req.body.email.trim();
    let flash_count = 0;
    if (!username || !password || !passwordConfirm) {
        req.flash("usernameError", "Please fill out compulsory fields");
        req.flash("passwordError", "Please fill out compulsory fields");
        req.flash("passwordConfirmError", "Please fill out compulsory fields");
        flash_count++;
    }
    if (await User.findOne({ username: username })) {
        req.flash("usernameError", "Username already exists");
        flash_count++;
    }
    if (password.length < 6) {
        req.flash(
            "passwordError",
            "Password must be atleast 6 chars in length"
        );
        flash_count++;
    }
    if (password != passwordConfirm) {
        req.flash("passwordConfirmError", "Password must be same");
        flash_count++;
    }
    if (flash_count > 0) {
        if (username || name || email) {
            req.flash("usernameValue", username);
            req.flash("nameValue", name);
            req.flash("emailValue", email);
        }
        res.redirect("/auth/signup");
    } else {
        createNewUser(req, res, username, password, name, email);
    }
});

route.get("/signin", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/home");
    } else {
        error = req.flash("error");
        if (error == "Incorrect password.") {
            passwordError = "Incorrect password.";
            usernameError = "";
        } else if (error == "Incorrect username.") {
            usernameError = "Incorrect username.";
            passwordError = "";
        } else {
            usernameError = "";
            passwordError = "";
        }
        res.render("signin", {
            title: "Sign In | Todos",
            passwordError,
            usernameError,
            isAuthenticated: false,
        });
    }
});
route.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/auth/signin",
        failureFlash: true,
    })
);

route.get("/signout", function (req, res) {
    if (req.isAuthenticated()) {
        req.logout();
        res.redirect("/");
    } else {
        res.redirect("/");
    }
});

route.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

route.get(
    "/google/todos",
    passport.authenticate("google", { failureRedirect: "/auth/signin" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/home");
    }
);

module.exports = {
    authRoute: route,
};
