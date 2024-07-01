const {
    SlashCommandBuilder,
    EmbedBuilder
    } = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");
const Wpn = require("/home/container/src/database/Weapon.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get information about bot stats of a user")
    .addUserOption(option => option
                  .setName("user")
                  .setDescription("The user you want the information of")),
async execute(interaction, client) {
    const userGet = interaction.options.getUser("user") || interaction.user;
    let gang;
    
 const user = await Usr.findOne({
     userId: userGet.id,
     guildId: interaction.guild.id
 });

    if (!user.gangId) {
        gang = null
    } else {
        gang = await Gng.findOne({
            _id: user.gangId
        });
        }
        
    const emb = new EmbedBuilder()
    .setColor("121212")
    .setTimestamp()
    .setAuthor({
        name: userGet.username
    })
    .addFields(
        {
            name: `Gang`,
            value: `${gang ? gang.name : "Not in a gang"}`
        },
        {
            name: `Profession`,
            value: `${user.profession ? user.profession : "Unemployed"}`
        },
        {
            name: `Money`,
            value: `${user.cash + user.wallet}`
        },
        {
            name: `Weapons`,
            value: `Work in process`
        }
    )
 interaction.reply({
     embeds: [emb],
 });
},
};
