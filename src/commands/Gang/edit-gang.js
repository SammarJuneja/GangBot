const {
     SlashCommandBuilder,
     EmbedBuilder,
     ActionRowBuilder,
     ModalBuilder,
     TextInputBuilder,
     TextInputStyle
} = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");

module.exports = {
    data: new SlashCommandBuilder()
     .setName("edit-gang")
     .setDescription("Edit your gang"),
async execute(interaction, client) {
const gang = await Gng.findOne({
    leader: interaction.user.id,
    local: interaction.guild.id
});

if (!gang) {
    interaction.reply({
        content: "You are not a gang leader",
        ephemeral: true
    });
} else {
    const editModal = new ModalBuilder()
      .setTitle("Edit gang")
      .setCustomId("edi-gang")

     const editName = new TextInputBuilder()
     .setLabel("Name")
     .setMinLength(1)
     .setMaxLength(30)
     .setCustomId("edit-name")
     .setStyle(TextInputStyle.Short)
     .setRequired(false)

    const editDescription = new TextInputBuilder()
     .setLabel("Description")
     .setMinLength(1)
     .setMaxLength(200)
     .setCustomId("edit-description")
     .setStyle(TextInputStyle.Paragraph)
     .setRequired(false)

    const editLogo = new TextInputBuilder()
     .setLabel("Logo")
     .setCustomId("edit-logo")
     .setStyle(TextInputStyle.Short)
     .setRequired(false)

    const editname = new ActionRowBuilder().addComponents(editName);
    const editdescription = new ActionRowBuilder().addComponents(editDescription);
    const editlogo = new ActionRowBuilder().addComponents(editLogo);

    editModal.addComponents(editname, editdescription, editlogo)

    await interaction.showModal(editModal)
}
},
};
