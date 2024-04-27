const isImageURL = require('image-url-validator').default;
const db = require("mongoose");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");
                   
module.exports = {
  data: {
    name: `cre-gang`
  },
  async execute(interaction, client) {
      const gname = await interaction.fields.getTextInputValue('gang-name')
      const gdescription = await interaction.fields.getTextInputValue('gang-description')
      const glogo = await interaction.fields.getTextInputValue('gang-logo')
     await isImageURL(`${glogo}`).then(async is_image => {
    if(is_image === false) {
      await interaction.reply({ content: "The image link is not valid"})
    } else {
      const gngSch = new Gng({
          name: `${gname}`,
          description: `${gdescription}` || "",
          logo: `${glogo}` || "https://media.discordapp.net/attachments/874887845049950259/1110475306688581682/Logevall-mediumSquareAt3X.jpg",
          leader: interaction.user.id,
          local: interaction.guild.id,
          fund: 0,
        });
        gngSch.save()
     await Usr.updateOne({
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      }, {$set: {
        gangId: gngSch._id,
        role: "Leader",
      }
     });
        usr.save();
      await interaction.reply({ content: `Gang Created by the name \`${gname}\``})
    }
});
},
}