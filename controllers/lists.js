const { List } = require("../db/model");
async function createNewList(listName) {
    try {
        list = await List.create({
            name: listName,
            dateCreated: new Date(),
            dateUpdated: new Date(),
        });
        return list;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createNewList,
};
