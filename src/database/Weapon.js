const db = require("mongoose");

const wep = new db.Schema({
    user: db.Schema.Types.ObjectId,
    knife: Number,
    bat: Number,
    glock: Number,
    ak47: Number,
    bazooka: Number,
    total: Number
})

module.exports = db.model("weapon", wep);
