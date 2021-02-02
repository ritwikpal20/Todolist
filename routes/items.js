const { Router } = require("express");
const _ = require("lodash");
const { date, time } = require("../utils/dateTime");
const {
    defaultItem,
    insertNewItem,
    deleteAItem,
} = require("../controllers/items");
const { createNewList, deleteAList } = require("../controllers/lists");
const { List, Item } = require("../db/model");
const passport = require("../utils/passport");

const route = Router();

// get: /home/ route will display all the lists created
route.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        List.find((err, lists) => {
            if (err) {
                console.log(err);
            } else {
                if (lists) {
                    res.render("home", {
                        lists: lists,
                        title: "Home",
                        startCase: _.startCase,
                    });
                } else {
                    res.render("home", { lists: "", title: "Home" });
                }
            }
        });
    } else {
        res.redirect("/auth/signin");
    }
});
// post: /home route will create new list.if the list with same name is already present , it will redirect to previous one
route.post("/", async (req, res) => {
    if (req.isAuthenticated()) {
        let listName = _.kebabCase(req.body.listName);
        if (await List.findOne({ name: listName })) {
            res.redirect(`/home/${listName}`);
        } else {
            let listDescription = req.body.listDescription;
            try {
                const newList = await createNewList(listName, listDescription);
                await defaultItem(newList._id);
                res.redirect(`/home/${listName}`);
            } catch (e) {
                console.log(e);
            }
        }
    } else {
        res.redirect("/auth/signin");
    }
});

// post: /home/delete will create a list given a list id
route.post("/delete", async (req, res) => {
    if (req.isAuthenticated()) {
        let listId = req.body.listId;
        await deleteAList(res, listId);
    } else {
        res.redirect("/auth/signin");
    }
});
// get: /home/:list will show the list given the list name
route.get("/:list", async (req, res) => {
    if (req.isAuthenticated()) {
        const listName = _.kebabCase(req.params.list);
        let getList = await List.findOne({ name: listName });
        if (getList) {
            res.render("index", {
                dmy: date(),
                time: time(),
                items: getList.items,
                listName: _.startCase(listName),
                title: _.startCase(listName) + " | Todos",
                err: "",
            });
        } else {
            res.render("index", {
                err: "No such List found",
                title: _.startCase(listName) + " | Todos",
            });
        }
    } else {
        res.redirect("/auth/signin");
    }
});
// post: /home/:list will  insert a item into a given list
route.post("/:list", async (req, res) => {
    if (req.isAuthenticated()) {
        const listName = _.kebabCase(req.params.list);
        const newItem = req.body.newItem;
        await insertNewItem(listName, newItem);
        res.redirect(`/home/${listName}`);
    } else {
        res.redirect("/auth/signin");
    }
});
// post: /home/:list/delete will delete a item from a given list
route.post("/:list/delete", async (req, res) => {
    if (req.isAuthenticated()) {
        let listName = _.kebabCase(req.params.list);
        let idsToDelete = req.body.idsToDelete;
        await deleteAItem(res, listName, idsToDelete);
    } else {
        res.redirect("/auth/signin");
    }
});

module.exports = {
    itemsRoute: route,
};
