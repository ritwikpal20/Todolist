const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testTodolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const itemSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
    },
    dateUpdated: {
        type: Date,
    },
});

const Item = mongoose.model("Item", itemSchema);

const listSchema = mongoose.Schema({
    name: {
        type: String,
        max: 50,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    dateCreated: {
        type: Date,
    },
    dateUpdated: {
        type: Date,
    },
    items: {
        type: [itemSchema],
    },
});

const List = mongoose.model("List", listSchema);

module.exports = {
    Item,
    List,
};
