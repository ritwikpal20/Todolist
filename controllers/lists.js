const { List, Item } = require("../db/model");
const { defaultItem } = require("./items");
async function createNewList(res, userId, listName, listDescription) {
    try {
        list = await List.create({
            name: listName,
            description: listDescription,
            userId: userId,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            itemsOrder: [],
        });
        await list.save();
        await defaultItem(res, list._id);
    } catch (e) {
        console.log(e);
    }
}

async function deleteAList(res, listId) {
    try {
        await Item.deleteMany({ listId: listId });
        await List.deleteOne({ _id: listId }, function (err) {
            if (err) {
                console.log(error);
            } else {
                res.send("List Deleted");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createNewList,
    deleteAList,
};
