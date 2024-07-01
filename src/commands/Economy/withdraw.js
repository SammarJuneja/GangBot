const {
    SlashCommandBuilder
} = require("discord.js");
const Gng = require("../../database/CreateGang");
const Usr = require("../../database/User");

module.exports = {
   data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw momey from your wallet")
    .addStringOption(option => option
       .setName("amount")
       .setDescription("Amount to withdraw or use all")
       .setRequired(true)),
async execute(interaction, client) {
const amount = interaction.options.getString("amount");

const user = await Usr.findOne({
   userId: interaction.user.id,
   guildId: interaction.guild.id
});

if (amount === "all") {
if (user.wallet > 0) {
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   }, {$inc: {
     cash: user.wallet,
     wallet: -user.wallet
   }
   });
   interaction.reply({
     content: "You withdrew all your money from bank"
   });
} else {
   interaction.reply({
     content: "Your balance is 0"
   });
}
} else if (user.wallet > 0) {
   if (amount <= 0) {
      interaction.reply({
        content: "Withdraw amount should be a more than 0"
      });
   } else {
   if (user.wallet >= amount) {
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   }, {$inc: {
     cash: amount,
     wallet: -amount
   }
   });
   interaction.reply({
     content: `You successfully withdrew ${amount} in bank`
   });
  }
  } 
  } else {
     interaction.reply({
       content: `You don't have ${amount} in bank`
     });
   }
 },
};