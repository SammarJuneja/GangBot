const { ActionRowBuilder,
       SlashCommandBuilder,
       EmbedBuiler,
       ModalBuilder,
       TextInputBuilder,
       TextInputStyle } = require('discord.js');
const Usr = require("/home/container/src/database/User.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-gang')
    .setDescription('Creates a gang'),
  async execute(interaction, client) {
  const gangCheck = await Usr.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id
  });
  if (!gangCheck.gangId) {
    const gangModal = new ModalBuilder()
    .setTitle('Create Gang')
    .setCustomId('cre-gang');


    const gangname = new TextInputBuilder()
    .setCustomId('gang-name')
    .setLabel("Write the gang name")
    .setMaxLength(30)
    .setMinLength(1)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const gangdescription = new TextInputBuilder()
    .setCustomId('gang-description')
		.setLabel("Write the gang description (200 words)")
      .setMaxLength(200)
      .setMinLength(10)
      //.setRequired(true)
  .setStyle(TextInputStyle.Paragraph);

    const ganglogo = new TextInputBuilder()
    .setCustomId('gang-logo')
    .setLabel("Paste the gang logo link")
    .setStyle(TextInputStyle.Short);

    
    const gname = new ActionRowBuilder().addComponents(gangname);
    const gdescription = new ActionRowBuilder().addComponents(gangdescription);
    const glogo = new ActionRowBuilder().addComponents(ganglogo);

  gangModal.addComponents(gname, gdescription, glogo);
    await interaction.showModal(gangModal)
      } else {
          interaction.reply({
              content: "You are already in a gang",
              ephemeral: true
          });
          }
  },
};
