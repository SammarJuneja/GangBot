const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const owners = [
    "670249406527963147",
    "1077766221929402378",
    "1036685598938894388",
    "696368083517964288",
    "548419804147613717",
    "631721449140518912",
    "800322387060195339",
    "1221719516606894142",
    "656762869043691530",
    "661566131383042078",
    "809154351951380520"
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction, client) {
  const commandName = interaction.options.getString('command', true).toLowerCase();
 if (owners.includes(interaction.user.id)) {
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }
    //delete require.cache[require.resolve(`/home/container/src/commands//${command.data.name}.js`)];

try {
	interaction.client.commands.delete(command.data.name);
    
const CommandFolders = fs.readdirSync('/home/container/src/commands');

for (const folder of CommandFolders) {

    const newCommand = fs.readdirSync(`/home/container/src/commands/${folder}`).filter(file => file.endsWith('.js'));

    if (newCommand.includes(`${command.data.name}.js`)) {
        const cmdPath = `/home/container/src/commands/${folder}/${command.data.name}.js`;
        delete require.cache[require.resolve(cmdPath)];
const cmd = require(cmdPath);
        
interaction.client.commands.set(cmd.data.name, cmd);

        await interaction.reply(`Command \`${cmd.data.name}\` was reloaded from the ${folder} folder!`);
        break;
    }
}
} catch (error) {
	console.error(error);
	await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
    }
     } else {
         interaction.reply({
             content: "You cannot use this command",
             ephemeral: true
         });
     }
	},
};
