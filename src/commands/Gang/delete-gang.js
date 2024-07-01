const { SlashCommandBuilder } = require('discord.js');
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delete-gang')
    .setDescription('Deletes a gang'),
  async execute(interaction, client) {
 const gangCheck = await Gng.findOne({
       leader: interaction.user.id,
       local: interaction.guild.id
   });
     if (gangCheck === null) {
         interaction.reply({
             content: "You are not a leader of any gang",
             ephemeral: true
         })
     } else {
      interaction.reply({
          content: `You deleted your gang \`${gangCheck.name}\``
      });
      await Gng.deleteOne({
          leader: interaction.user.id,
          local: interaction.guild.id
      });
      await Usr.upateMany({
          gangId: gangCheck._id
      }, {$set: {
          gangId: null
      }
      });
     }
  },
};
