const db = require("mongoose");

const gng = new db.Schema({
    name: String,
    description: String,
    logo: String,
    member: [String],
    coLeader: [String],
    elite: [String],
    id: String,
    leader: String,
    local: String,
    fund: Number
})

module.exports = db.model("Gang", gng);