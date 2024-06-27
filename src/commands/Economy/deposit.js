const {
    SlashCommandBuilder
} = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
   data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit your cash into bank")
    .addStringOption(option => option
       .setName("amount")
       .setDescription("Amount to deposit or use all")
       .setRequired(true)),
async execute(interaction, client) {
const amount = interaction.options.getString("amount");

const user = await Usr.findOne({
   userId: interaction.user.id,
   guildId: interaction.guild.id
});

if (amount === "all") {
if (user.cash > 0) {
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   }, {$inc: {
     wallet: user.cash,
     cash: -user.cash
   }
   });
   interaction.reply({
     content: "You deposited all your money in bank"
   });
} else {
   interaction.reply({
     content: "Your balance is 0"
   });
}
} else if (user.cash > 0) {
   if (amount <= 0) {
      interaction.reply({
        content: "Deposit amount should be a positive number"
      });
   } else {
   if (user.cash >= amount) {
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   }, {$inc: {
     wallet: amount,
     cash: -amount
   }
   });
   interaction.reply({
     content: `You successfully deposited ${amount} in bank`
   });
  }
  } 
  } else {
     interaction.reply({
       content: `You don't have ${amount} in cash`
     });
   }
 },
};