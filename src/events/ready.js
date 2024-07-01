const { Events } = require('discord.js');
const db = require("mongoose");
require("dotenv").config();

module.exports = {
	name: Events.ClientReady,
	once: true,
    async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        main().catch(err => console.log(err));
        console.log("Mongo connected")
	},
};

async function main() {
    await db.connect(process.env.MONGO_URI);
}
