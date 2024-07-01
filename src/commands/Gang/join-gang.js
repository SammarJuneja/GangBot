const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder} = require("discord.js")
const db = require("mongoose")
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("join-gang")
    .setDescription("Join a gang by mentioning the gang leader")
    .addUserOption(option =>
            option
                .setName('leader')
                .setDescription('The leader of gang you want to join')
                .setRequired(true)),
async execute(interaction, client) {
 const userGet = interaction.options.getUser('leader');
    
 const author = interaction.user;
    
 const gangCheck = await Gng.findOne({
 $or: [
  { leader: interaction.user.id },
  { coLeader: [interaction.user.id] },
  { elite: [interaction.user.id] }
      ],
     local: interaction.guild.id
 });
    
 const authorGang = await Usr.findOne({
     userId: interaction.user.id
 });
    
  if (userGet.bot) {
      interaction.reply({
          content: "Bots don\'t have any gangs",
          ephemeral: true
      });
  }
    
  if (userGet.id === interaction.user.id) {
      interaction.reply({
          content: "Don\'t mention yourself",
          ephemeral: true
      })
  }
    
  if (!gangCheck) {
      interaction.reply({
          content: `\`${userGet.username}\` is not a gang higher up`,
          ephemeral: true
      });
  }
    
  if (authorGang !== null) {
 interaction.reply({
    content: "You are already in a gang",
    ephemeral: true
 })
  }
    

  const accept = new ButtonBuilder()
  .setCustomId(`accept`)
     .setLabel("Accept")
     .setStyle(ButtonStyle.Primary)
   
  const reject = new ButtonBuilder()
  .setCustomId(`reject`)
     .setLabel("Reject")
     .setStyle(ButtonStyle.Danger)
   
  const row = new ActionRowBuilder()
     .addComponents(accept, reject)
   
  const response = await interaction.reply({
   content: `${interaction.user} would like to join your gang ${userGet}`,
   components: [row]
  });
    const collectorFilter = i => i.user. id === userGet.id;
     
    const confirmation = await response.awaitMessageComponent({
         filter: collectorFilter,
         time: 30_000,
         max: 1,
         error: ["time"]
     });
 if (confirmation.customId === `accept`) {
  if (authorGang === null) {
const gangLeader = await Gng.findOne({
 $or: [
  { leader: interaction.user.id },
  { coLeader: [interaction.user.id] },
  { elite: [interaction.user.id] }
      ],
    local: interaction.guild.id
 })
      await confirmation.channel.send(`${author}, Your request was accepted by \`${userGet.username}\``);
   const newUser = new Usr({
       userId: author.id,
       guildId: confirmation.guild.id,
       gangId: gangCheck._id,
       role: "Member",
       cash: authorGang.cash,
       wallet: authorGang.wallet
   });
      newUser.save()
   await Gng.updateOne({
       leader: userGet.id,
       local: confirmation.guild.id
   },
    {$push: {
      member: author.id
     }
    });
 const acceptDis = accept.setDisabled(true)
 const rejectDis =   reject.setDisabled(true)
      
  const updatedRow = new ActionRowBuilder()
  .setComponents(acceptDis, rejectDis)
     await confirmation.update({
       content: confirmation.content,
       components: [updatedRow]
     });
  } else {
      confirmation.channel.send({
          content: `${author} already joined a gang`
      });
    }
 } else if (confirmation.customId === `reject`) {
     const acceptDis = accept.setDisabled(true)
 const rejectDis =   reject.setDisabled(true)
      
  const updatedRow = new ActionRowBuilder()
  .setComponents(acceptDis, rejectDis)
     await confirmation.update({
       content: confirmation.content,
       components: [updatedRow]
     });
 confirmation.channel.send(`${author}, Your request was rejected by ${userGet.username}`);
} else {
    confirmation.reply({
        content: "You can\'t press this button",
        ephemeral: true
    });
}
    },
};
        
