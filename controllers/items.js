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

async function insertNewItem(newItem) {
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
}

module.exports = {
    defaultItem,
    insertNewItem,
};
