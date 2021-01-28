const { List } = require("../db/model");
async function createNewList(listName, listDescription) {
    try {
        list = await List.create({
            name: listName,
            description: listDescription,
            dateCreated: new Date(),
            dateUpdated: new Date(),
        });
        return list;
    } catch (e) {
        console.log(e);
    }
}

async function deleteAList(res, listId) {
    try {
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
