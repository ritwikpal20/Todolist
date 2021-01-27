const { Router } = require("express");
const { date, time } = require("../utils/dateTime");
const {
    defaultItem,
    insertNewItem,
    deleteAItem,
} = require("../controllers/items");
const { createNewList } = require("../controllers/lists");
const { List, Item } = require("../db/model");

const route = Router();

route.get("/", (req, res) => {
    List.find((err, lists) => {
        if (err) {
            console.log(err);
        } else {
            if (lists) {
                res.render("home", { lists: lists, title: "Home" });
            } else {
                res.render("home", { lists: "", title: "Home" });
            }
        }
    });
});
route.post("/", async (req, res) => {
    let listName = req.body.listName;
    console.log("list name in /", `${listName}`);
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
    const newItem = req.body.newItem;
    await insertNewItem(listName, newItem);
    res.redirect(`/home/${listName}`);
});

route.post("/:list/delete", async (req, res) => {
    let listName = req.params.list;
    let idsToDelete = req.body.idsToDelete;
    console.log("listName:", `*${listName}*`);
    await deleteAItem(res, listName, idsToDelete);
});

module.exports = {
    itemsRoute: route,
};
