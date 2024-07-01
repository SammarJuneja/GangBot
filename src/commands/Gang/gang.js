const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const db = require("mongoose");
const Gng = require("../../database/CreateGang");
const Usr = require("../../database/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gang')
        .setDescription('Shows the gang of user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to see gang of leave it empty if you want to see yours')),
 async execute(interaction, client) {
  const userOption = interaction.options.getUser('user') || interaction.user;
     
  const user = await Usr.findOne({
      userId: userOption.id,
      guildId: interaction.guild.id
  });
     
     console.log(user.gangId)
     
     if (!user.gangId) {
         return interaction.reply({
             content: `${user} is not in a gang`,
             ephemeral: true
         });
     }
     
  const gang = await Gng.findOne({
      _id: user.gangId
  });
            
 const CoLeader = gang.coLeader.map(id => `<@${id}>`).join(", ") || "No Co leaders";
            
 const Elite = gang.elite.map(id => `<@${id}>`).join(", ") || "No Elites";
            
 const Member = gang.member.map(id => `<@${id}>`).join(", ") || "No Members";
  
  /*const cash = members.map( money => money.cash)
  const wallet = members.reduce(money => money.wallet)
  let cashSum;
  cash.forEach(test => {
      cashSum += cash
  });
  let walletSum;
   wallet.forEach(test => {
      walletSum += wallet
  });
  const fund = cashSum + walletSum;*/
 
 const embed = new EmbedBuilder()
 .setTitle(`${gang.name}`)
 .setDescription(`${gang.description}
**Gang Leader**
<@${gang.leader}>
**Gang Co leaders**
${CoLeader}
**Gang Elites**
${Elite}
**Gang Members**
${Member}
**Gang Fund**
${gang.fund}`)
  .setColor('337799')
  .setThumbnail(`${gang.logo}`)
  .setTimestamp()
  interaction.reply({
      embeds: [embed]
  });
    },
};
