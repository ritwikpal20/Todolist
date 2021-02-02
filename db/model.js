const mongoose = require("mongoose");

if (process.env.NODE_ENV == "development") {
    mongoose.connect("mongodb://localhost:27017/testTodolistDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
} else {
    mongoose.connect(
        `mongodb+srv://ritwikpal20:${process.env.MONGO_PASSWORD}@todos.q04du.mongodb.net/testTodolistDB`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }
    );
}

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
    listId: {
        type: mongoose.Types.ObjectId,
    },
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = mongoose.Schema({
    name: {
        type: String,
        max: 50,
        required: true,
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
    userId: {
        type: mongoose.Types.ObjectId,
    },
});
const List = mongoose.model("List", listSchema);

const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    List,
    Item,
};
