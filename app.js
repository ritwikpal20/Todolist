const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./utils/passport");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/home");
    } else {
        res.render("main", { title: "Todos" });
    }
});

const { itemsRoute } = require("./routes/items");
const { authRoute } = require("./routes/auth");
app.use("/home", itemsRoute);
app.use("/auth", authRoute);

port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/`);
});
