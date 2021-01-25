const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/testTodolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const itemSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
    },
    dateUpdated: {
        type: Date,
    },
});
const Item = mongoose.model("Item", itemSchema);

app.get("/", async (req, res) => {
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

    items = await Item.find();
    if (items.length == 0) {
        await Item.insertMany(
            [
                {
                    text: "Welcome to todolist",
                    dateCreated: new Date(),
                    dateUpdated: new Date(),
                },
                {
                    text:
                        "To add items click on + button. To delete items select the items and click on delete button",
                    dateCreated: new Date(),
                    dateUpdated: new Date(),
                },
            ],
            (err) => {
                if (err) {
                    console.log(null);
                }
            }
        );
    }
    res.render("index", { dmy: dmy, time: strTime, items: items });
});

app.post("/", async (req, res) => {
    const newItem = req.body.newItem;
    await Item.insertMany(
        [
            {
                text: newItem,
                dateCreated: new Date(),
                dateUpdated: new Date(),
            },
        ],
        (err) => {
            if (err) {
                console.log(null);
            }
        }
    );
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    let idsToDelete = req.body.idsToDelete;
    idsToDelete = Object(idsToDelete);
    await Item.deleteMany({ _id: { $in: idsToDelete } });
    res.redirect("/");
});

app.listen(7000, () => {
    console.log("server started on http://localhost:7000");
});
