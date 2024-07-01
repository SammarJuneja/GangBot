const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.cooldowns = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".js"));
for (const file of functionFiles) {
    require(`./src/functions/${folder}/${file}`) (client);
}
}

client.handleCommands();
client.handleEvents();
client.handleComponents();

client.login(process.env.TOKEN)
