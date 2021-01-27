const express = require("express");
const { itemsRoute } = require("./routes/items");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

app.use("/home", itemsRoute);

app.listen(7000, () => {
    console.log("server started on http://localhost:7000/home");
});
