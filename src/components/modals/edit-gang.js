const isImageURL = require('image-url-validator').default;
const db = require("mongoose");
const Gng = require("../../database/CreateGang");
const Usr = require("../../database/User");
                   
module.exports = {
  data: {
    name: `edi-gang`
  },
async execute(interaction, client) {
   try {
    const gang = await Gng.findOne({
        leader: interaction.user.id,
        local: interaction.guild.id
    });
    const name = gang.name;
    const desc = gang.description;
    const logo = gang.logo;
    
    const gname = await interaction.fields.getTextInputValue('edit-name');
    const gdescription = await interaction.fields.getTextInputValue('edit-description');
    const glogo = await interaction.fields.getTextInputValue('edit-logo');
   const updatedLogo = glogo ? glogo : logo;

    if (glogo) {
        const isImage = await isImageURL(glogo);
        if (!isImage) {
          await interaction.reply({ content: "The image link is not valid", ephemeral: true });
          return;
        }
      }
      
      await Gng.updateOne({
        leader: interaction.user.id,
        local: interaction.guild.id
      }, {
        name: gname || name,
        description: gdescription || desc,
        logo: updatedLogo
      });
      
      await interaction.reply({
        content: "Gang edited successfully",
        ephemeral: true
      });
       } catch (error) {
           console.error(error)
       }
},
};
    