const { Item, List } = require("../db/model");

async function defaultItem(listId) {
    items = await Item.create([
        {
            text: "Welcome to todolist",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            listId: listId,
        },
        {
            text:
                "To add items click on + button. To delete items select the items and click on delete button",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            listId: listId,
        },
    ]);
}

async function insertNewItem(userId, listName, newItem) {
    const getList = await List.findOne({ name: listName, userId: userId });
    await Item.create({
        text: newItem,
        dateCreated: new Date(),
        dateUpdated: new Date(),
        listId: getList._id,
    });
}

async function deleteAItem(res, userId, listName, itemIds) {
    const getList = await List.findOne({ name: listName, userId: userId });
    await Item.deleteMany({ listId: getList._id, _id: { $in: itemIds } });
    res.send("success");
    // List.findOneAndUpdate(
    //     { name: listName },
    //     { $pull: { items: { _id: { $in: itemIds } } } },
    //     { useFindAndModify: false },
    //     (err, doc) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         res.send("success");
    //     }
    // );
}

module.exports = {
    defaultItem,
    insertNewItem,
    deleteAItem,
};
