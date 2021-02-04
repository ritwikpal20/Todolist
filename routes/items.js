const { Router } = require("express");
const _ = require("lodash");
const { date, time } = require("../utils/dateTime");
const { insertNewItem, deleteAItem } = require("../controllers/items");
const { createNewList, deleteAList } = require("../controllers/lists");
const { List, Item } = require("../db/model");
const passport = require("../utils/passport");
var CryptoJS = require("crypto-js");

const route = Router();

// get: /home/ route will display all the lists created
route.get("/", async (req, res) => {
    if (req.isAuthenticated()) {
        lists = await List.find({ userId: req.user._id });
        res.render("home", {
            lists: lists,
            title: "Home",
            startCase: _.startCase,
            isAuthenticated: true,
            user: req.user.name,
        });
    } else {
        res.redirect("/auth/signin");
    }
});
// post: /home route will create new list.if the list with same name is already present , it will redirect to previous one
route.post("/", async (req, res) => {
    if (req.isAuthenticated()) {
        let listName = _.kebabCase(req.body.listName);
        list = await List.findOne({ name: listName, userId: req.user._id });
        if (list) {
            res.redirect(`/home/${listName}`);
        } else {
            let listDescription = req.body.listDescription;
            try {
                await createNewList(
                    res,
                    req.user._id,
                    listName,
                    listDescription
                );
            } catch (e) {
                if (e) {
                    console.log(e);
                }
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
        let getList = await List.findOne({
            name: listName,
            userId: req.user._id,
        });
        if (getList) {
            let getItems = await Item.find({ listId: getList._id });
            getItems.map((item) => {
                var bytes = CryptoJS.AES.decrypt(
                    item.text,
                    process.env.CRYPTOJS_SECRET
                );
                item.text = bytes.toString(CryptoJS.enc.Utf8);
                return;
            });
            res.render("index", {
                dmy: date(),
                time: time(),
                items: getItems,
                listName: _.startCase(listName),
                title: _.startCase(listName) + " | Todos",
                err: "",
                isAuthenticated: true,
                user: req.user.name,
            });
        } else {
            res.render("index", {
                err: "No such List found",
                title: _.startCase(listName) + " | Todos",
                isAuthenticated: true,
                user: req.user.name,
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
        const newItem = CryptoJS.AES.encrypt(
            req.body.newItem,
            process.env.CRYPTOJS_SECRET
        ).toString();
        await insertNewItem(req.user._id, listName, newItem);
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
        await deleteAItem(res, req.user._id, listName, idsToDelete);
    } else {
        res.redirect("/auth/signin");
    }
});

module.exports = {
    itemsRoute: route,
};
