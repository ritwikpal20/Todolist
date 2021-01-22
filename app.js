const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

let items = [];

app.get("/", (req, res) => {
    var currentDate = new Date();
    //retreiving Month,day, year
    const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const dmy = longEnUSFormatter.format(currentDate);

    //retreiving time
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    res.render("index", { dmy: dmy, time: strTime, items: items });
});

app.post("/", (req, res) => {
    const newItem = req.body.newItem;
    items.push(newItem);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    let idsToDelete = req.body.idsToDelete;
    let idCounter = 0;
    let idDelete = idsToDelete[idCounter];
    const newItems = [];
    for (let i = 0; i < items.length; i++) {
        if (idDelete == i) {
            idCounter++;
            if (idCounter < idsToDelete.length)
                idDelete = idsToDelete[idCounter];
        } else {
            newItems.push(items[i]);
        }
    }
    items = newItems;
    res.redirect("/");
});

app.listen(7000, () => {
    console.log("server started on http://localhost:7000");
});
