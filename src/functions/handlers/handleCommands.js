const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.handleCommands = async () => {
const commandFolders = fs.readdirSync('./src/commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`../../commands/${folder}/${file}`);
        const hm = `${file}`
        const { commands, commandArray } = client;
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${hm} is missing a required "data" or "execute" property.`);
		}
	}
}
}
}