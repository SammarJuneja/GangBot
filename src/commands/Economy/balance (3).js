const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
     .setName("balance")
     .setDescription("See your balance")
    .addUserOption(option => option
                  .setName("user")
                  .setDescription("The user you want to see balance of")),
async execute(interaction, client) {
const userGet = interaction.options.getUser("user") || interaction.user;
const user = await Usr.findOne({
   userId: userGet.id,
   guildId: interaction.guild.id
});
    
interaction.client.users.fetch(userGet.id).then(async fetchedUser => {
    console.log(fetchedUser)
const emb = new EmbedBuilder()
  .setAuthor({
      name: fetchedUser.username
  })
  .addFields(
      {
          name: "Cash",
          value: `${user.cash || 0}`
      },
      {
          name: "Wallet",
          value: `${user.wallet || 0}`
      },
      {
          name: "Net worth",
          value: `${user.cash + user.wallet || 0}`
      }
  )
  .setColor("121212")

interaction.reply({
   embeds: [emb]
})
    });
 },
};