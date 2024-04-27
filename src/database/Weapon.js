const db = require("mongoose");
const user = require("/home/container/src/database/User.js");

const wep = new db.Schema({
    knife: Number,
    bat: Number,
    glock: Number,
    ak47: Number,
    bazooka: Number
})

module.exports = db.model("weapon", wep);
