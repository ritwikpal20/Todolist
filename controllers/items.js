const { Item, List } = require("../db/model");
var CryptoJS = require("crypto-js");

async function defaultItem(res, listId) {
    items = await Item.create([
        {
            text: CryptoJS.AES.encrypt(
                "Welcome to todolist",
                process.env.CRYPTOJS_SECRET
            ).toString(),
            dateCreated: new Date(),
            dateUpdated: new Date(),
            listId: listId,
        },
        {
            text: CryptoJS.AES.encrypt(
                "To add items click on + button. To delete items select the items and click on delete button",
                process.env.CRYPTOJS_SECRET
            ).toString(),
            dateCreated: new Date(),
            dateUpdated: new Date(),
            listId: listId,
        },
    ]);
    List.findOne({ _id: listId }, async function (err, list) {
        await list.itemsOrder.push({ $each: [items[0]._id, items[1]._id] });
        list.save();
        res.redirect(`/home/${list.name}`);
    });
}

async function insertNewItem(res, userId, listName, newItem) {
    const getList = await List.findOne({ name: listName, userId: userId });
    item = new Item({
        text: newItem,
        dateCreated: new Date(),
        dateUpdated: new Date(),
        listId: getList._id,
    });
    item.save(async (err) => {
        if (err) {
            console.log(err);
        } else {
            List.findOne(
                { name: listName, userId: userId },
                async function (err, list) {
                    await list.itemsOrder.push(item._id);
                    list.save();
                    res.redirect(`/home/${listName}`);
                }
            );
        }
    });
}

async function deleteAItem(res, userId, listName, itemIds) {
    const getList = await List.findOne({ name: listName, userId: userId });
    await Item.deleteMany({ listId: getList._id, _id: { $in: itemIds } });
    res.send("success");
}

module.exports = {
    defaultItem,
    insertNewItem,
    deleteAItem,
};
