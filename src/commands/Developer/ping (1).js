const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
        await interaction.reply(`Pong 🏓!\`${interaction.client.ws.ping}\`ms`);
	},
};