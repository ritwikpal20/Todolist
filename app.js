const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { itemsRoute } = require("./routes/items");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

app.use("/home", itemsRoute);

port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/home`);
});
