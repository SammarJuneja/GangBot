const { Events,
       InteractionType,
       Modals,
       Collection
      } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            var command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            const { cooldowns } = interaction.client;

if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
}

const now = Date.now();
            
const timestamps = cooldowns.get(command.data.name);
            
const defaultCooldownDuration = 3;
            
const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

                        
if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

if (now < expirationTime) {
    const expiredTimestamp = Math.round(expirationTime / 1_000);
    
    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
	}
}
            
   timestamps.set(interaction.user.id, now);

setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            
            try {
                await command.execute(interaction, client);
            } catch (error) {
       console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            //const { Modals } = require('discord.js');
            //const { customId } = interaction;
            //const modal = client.get(customId);

            const modal = interaction.client.modals.get(interaction.customId);
            if (!modal) return interaction.reply("There is no code for this modal");
            try {
                await modal.execute(interaction, client)
            } catch(error) {
                console.error(error)
            }
            console.log('hello');
        } /*else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);
           if (!button) return;
           if (!button) return new Error ("There is no code for this button");
           try {
               await button.execute(interaction, client)
           } catch (error) {
               console.error(error)
           }
        }*/
    },
};
