const { Router } = require("express");
const { date, time } = require("../utils/dateTime");
const { defaultItem, insertNewItem } = require("../controllers/items");
const { createNewList } = require("../controllers/lists");
const { List } = require("../db/model");

const route = Router();

route.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});
route.post("/", async (req, res) => {
    const listName = req.body.listName;
    try {
        const newList = await createNewList(listName);
        res.redirect(`/home/${listName}`);
    } catch (e) {
        console.log(e);
    }
});

route.get("/:list", async (req, res) => {
    const listName = req.params.list;
    let getList = await List.findOne({ name: listName });
    if (getList) {
        if (getList.items.length == 0) {
            await defaultItem(getList._id);
            getList = await List.findOne({ name: listName });
        }
        res.render("index", {
            dmy: date,
            time: time,
            items: getList.items,
            listName: listName,
            title: listName + " | Todos",
            err: "",
        });
    } else {
        res.render("index", {
            err: "No such List found",
            title: listName + " | Todos",
        });
    }
});

route.post("/:list", async (req, res) => {
    const listName = req.params.list;

    // const newItem = req.body.newItem;
    // await insertNewItem(newItem);
    // res.redirect("/:list");
});

route.post("/delete", async (req, res) => {
    let idsToDelete = req.body.idsToDelete;
    idsToDelete = Object(idsToDelete);
    await Item.deleteMany({ _id: { $in: idsToDelete } });
    res.redirect("/index");
});

module.exports = {
    itemsRoute: route,
};
