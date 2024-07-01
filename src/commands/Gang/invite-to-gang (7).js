const {
    SlashCommandBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder
} = require("discord.js")
const db = require("mongoose")
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("invite-to-gang")
    .setDescription("Invite a member to gang")
    .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The member you want to invite')
                .setRequired(true)),
 async execute(interaction, client) {
 const userGet = interaction.options.getUser('user');
     
 const author = interaction.user;
        
 const gangCheck = await Gng.findOne({
 $or: [
  { leader: interaction.user.id },
  { coLeader: [interaction.user.id] },
  { elite: [interaction.user.id] }
      ],
     local: interaction.guild.id
 });
 
 const userGang = await Usr.findOne({
     userId: userGet.id,
     guildId: interaction.guild.id
 });
        
  if (!gangCheck) {
      interaction.reply({
          content: `You should atleast be an elite to invite`
      });
  }
  
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
      });
  }
     
  if (userGang !== null) {
      interaction.reply({
          content: `${userGet} is already in a gang`,
          ephemeral: true
      });
  }
  
  const accept = new ButtonBuilder()
.setCustomId(`acceptReq`)
     .setLabel("Accept")
     .setStyle(ButtonStyle.Primary)
   
  const reject = new ButtonBuilder()
.setCustomId(`rejectReq`)
     .setLabel("Reject")
     .setStyle(ButtonStyle.Danger)
   
  const row = new ActionRowBuilder()
     .addComponents(accept, reject)
   
  const response = await interaction.reply({
   content: `${interaction.user} invited you to their gang. ${userGet}`,
   components: [row]
  });
    const collectorFilter = i => i.user. id === userGet.id;
     
    const confirmation = await response.awaitMessageComponent({
         filter: collectorFilter,
         time: 30_000,
         max: 1,
         error: ["time"]
     });
 if (confirmation.customId === `acceptReq`) {
  if (userGang === null) {
      await confirmation.channel.send(`${author}, Your invitation was accepted by \`${userGet.username}\``);
   const newUser = new Usr({
       userId: userGet.id,
       guildId: confirmation.guild.id,
       gangId: gangCheck._id,
       role: "Member",
       cash: userGang.cash,
       wallet: userGang.wallet
   });
      newUser.save();
   await Gng.updateOne({
       leader: author.id,
       local: confirmation.guild.id
   },
    {$push: {
      member: userGet.id
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
   const acceptDis = accept.setDisabled(true)
 const rejectDis =   reject.setDisabled(true)

  const updatedRow = new ActionRowBuilder()
  .setComponents(acceptDis, rejectDis)
     await confirmation.update({
       content: confirmation.content,
       components: [updatedRow]
     });
      await confirmation.channel.send({
          content: `${userGet} already joined a gang`
      });
    }
 } else if (confirmation.customId === `rejectReq`) {
     const acceptDis = accept.setDisabled(true)
 const rejectDis =   reject.setDisabled(true)
      
  const updatedRow = new ActionRowBuilder()
  .setComponents(acceptDis, rejectDis)
     await confirmation.update({
       content: confirmation.content,
       components: [updatedRow]
     });
 confirmation.reply({
     content: `${author}, Your invitation was rejected by ${userGet.username}`
 });
     
 } else {
     confirmation.reply({
         content: "You can\'t press this button",
         ephemeral: true
     });
 }
    },
};
        