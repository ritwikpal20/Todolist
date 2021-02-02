const { Item, List } = require("../db/model");

async function defaultItem(listId) {
    const getList = await List.findOne({ _id: listId });
    if (getList.items.length == 0) {
        await List.updateOne(
            { _id: listId },
            {
                items: [
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
            }
        );
    }
}

async function insertNewItem(listName, newItem) {
    const getList = await List.findOne({ name: listName });
    getList.items.push({
        text: newItem,
        dateCreated: new Date(),
        dateUpdated: new Date(),
    });
    getList.save();
}

async function deleteAItem(res, listName, itemIds) {
    const getList = await List.findOne({ name: listName });
    List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: { $in: itemIds } } } },
        { useFindAndModify: false },
        (err, doc) => {
            if (err) {
                console.log(err);
            }
            res.send("success");
        }
    );
}

module.exports = {
    defaultItem,
    insertNewItem,
    deleteAItem,
};
