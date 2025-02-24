const db = require("mongoose");

const user = new db.Schema({
    userId: String,
    guildId: String,
    gangId: db.Schema.Types.ObjectId,
    role: String,
    cash: Number,
    wallet: Number,
    kidnapped: Boolean,
    profession: String,
    poccess: [String],
    health: Number
});

module.exports = db.model("User", user);
