const { SlashCommandBuilder } = require("discord.js");
const db = require("mongoose");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave-gang')
        .setDescription('Leaves the gang you are in'),
 async execute(interaction, client) {
        try {
 const member = await Usr.find({
     userId: interaction.user.id,
     guildId: interaction.guild.id
 });
  const gang = await Gng.find({
      _id: member[0].gangId
  }); 
      if (gang[0].leader === interaction.user.id) {
            interaction.reply({
               content: `You cannot leave gang as a leader run \`/delete-gang\` to delete the gang`,
               ephemeral: true
            });
        } else if (member.length > 0) {
    await Gng.updateOne({
        leader: gang[0].leader,
        local: interaction.guild.id},
{$pull:
 {member: `${interaction.user.id}`}
});
     await Gng.updateOne({
        leader: gang[0].leader,
        local: interaction.guild.id},
{$pull:
 {coLeader: `${interaction.user.id}`}
});
      await Gng.updateOne({
        leader: gang[0].leader,
        local: interaction.guild.id},
{$pull:
 {elite: `${interaction.user.id}`}
});
              
    await Usr.updateOne({
        userId: interaction.user.id,
        guildId: interaction.guild.id
    }, {$set: {
        gangId: null
       }
    });          
              
        interaction.reply(`You left the gang \`${gang[0].name}\``);
} else {
    interaction.reply("You are not in any gang.");
}
        } catch (err) {
            console.error(err)
        }
    },
};



                