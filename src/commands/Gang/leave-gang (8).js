const { SlashCommandBuilder } = require("discord.js");
const db = require("mongoose");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave-gang')
        .setDescription('Leaves the gang you are in'),
async execute(interaction, client) {
     
 const member = await Usr.findOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
 });
     
   if (!member.gangId) {
       interaction.reply({
           content: `You are not in a gang`
       });
   }
     
 const gang = await Gng.findOne({
      _id: member.gangId
  });
     
      if (gang.leader === interaction.user.id) {
          interaction.reply({
              content: `You cannot leave gang as a leader run \`/delete-gang\` to delete the gang`,
              ephemeral: true
          });
        }
     
     await Gng.updateOne({
         leader: gang.leader,
         local: interaction.guild.id
     }, {$pull:
         {member: interaction.user.id}
        });
     
     await Gng.updateOne({
        leader: gang.leader,
        local: interaction.guild.id
     }, {$pull:
         {coLeader: interaction.user.id}
        });
     
     await Gng.updateOne({
        leader: gang.leader,
        local: interaction.guild.id
     }, {$pull:
         {elite: interaction.user.id}
        });
              
    await Usr.updateOne({
        userId: interaction.user.id,
        guildId: interaction.guild.id
    }, {$set: {
        gangId: null
       }
    });
     interaction.reply({
         content: `You left the gang \`${gang.name}\``
     });
    },
};



                