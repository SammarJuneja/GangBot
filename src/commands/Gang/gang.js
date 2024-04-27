const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const db = require("mongoose");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gang')
        .setDescription('Shows the gang of user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to see gang of leave it empty if you want to see yours')),
    async execute(interaction, client) {
  const userOption = interaction.options.getUser('user') || interaction.user
  let gang;
  console.log(userOption)
  const authorGang = await Usr.find({
      userId: userOption.id,
      guildId: interaction.guild.id
  });
        if (authorGang.length > 0) {
            gang = authorGang[0];
  const gangLeader = await Gng.find({
      _id: authorGang[0].gangId
  })         
  const glead = gangLeader[0];
  const CoLeader = glead.coLeader.map(id => `<@${id}>`).join(", ") || "No Co leaders";
            
  const Elite = glead.elite.map(id => `<@${id}>`).join(", ") || "No Elites";
            
  const Member = glead.member.map(id => `<@${id}>`).join(", ") || "No Members";
            interaction.client.users.fetch(glead.leader).then(lead => {
 const embed = new EmbedBuilder()
 .setTitle(`${glead.name}`)
 .setDescription(`${glead.description}
**Gang Leader**
<@${glead.leader}>
**Gang Co leaders**
${CoLeader}
**Gang Elites**
${Elite}
**Gang Members**
${Member}`)
  .setColor('337799')
  .setThumbnail(`${glead.logo}`)
  .setTimestamp()
/*.setFooter({
    text: `${lead.username}`
});*/
  interaction.reply({
      embeds: [embed]
  });
            });
        } else {
            interaction.reply(`\`${userOption.username}\` is not in any gang.`);
        }
    },
};