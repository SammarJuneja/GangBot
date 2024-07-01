const { Events } = require('discord.js');
const db = require("mongoose")

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
    await db.connect("mongodb+srv://Wilson:7S8TNe6EeAjXfHGZ@cluster0.vdw53jb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    }