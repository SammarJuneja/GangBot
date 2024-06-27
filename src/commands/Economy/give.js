const Usr = require("/home/container/src/database/User.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give money to your gang members")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user you want to give money")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("amount")
        .setDescription("Amount you want to give or all")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const userGet = interaction.options.getUser("user");
      const amount = interaction.options.getString("amount");
      const user = await Usr.findOne({
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      });

      const mentionedUser = await Usr.findOne({
        userId: userGet.id,
        guildId: interaction.guild.id,
      });

      if (!user) {
        return interaction.reply({
          content: "You are not registered.",
          ephemeral: true,
        });
      }

      if (!mentionedUser) {
        return interaction.reply({
          content: `${userGet.tag} is not registered.`,
          ephemeral: true,
        });
      }

      if (!user.gangId) {
        return interaction.reply({
          content: "You are not in a gang",
          ephemeral: true,
        });
      }

      if (!user.gangId.equals(mentionedUser.gangId)) {
        return interaction.reply({
          content: `${userGet.tag} is not in your gang`,
          ephemeral: true,
        });
      }

      if (user.cash <= 0) {
        return interaction.reply({
          content: "You don't have any cash in hand right now",
          ephemeral: true,
        });
      }

      let transferAmount = amount.toLowerCase() === "all" ? user.cash : parseInt(amount, 10);

      if (isNaN(transferAmount) || transferAmount <= 0) {
        return interaction.reply({
          content: "The amount must be a positive number or 'all'.",
          ephemeral: true,
        });
      }

      if (user.cash < transferAmount) {
        return interaction.reply({
          content: `You don't have enough cash to give ${transferAmount}`,
          ephemeral: true,
        });
      }

      await Usr.updateOne(
        { userId: interaction.user.id, guildId: interaction.guild.id },
        { $inc: { cash: -transferAmount } }
      );

      await Usr.updateOne(
        { userId: userGet.id, guildId: interaction.guild.id },
        { $inc: { cash: transferAmount } }
      );

      interaction.reply({
        content: `You gave ${transferAmount} to ${userGet.tag}`,
      });
    } catch (e) {
      console.error(e);
    }
  },
};