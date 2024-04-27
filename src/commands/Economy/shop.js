const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");


module.exports = {
    data: new SlashCommandBuilder()
     .setName("shop")
     .setDescription("To buy weapons"),
async execute(interaction, client) {
const user = await Usr.findOne({
   userId: interaction.user.id,
   guildId: interaction.guild.id
});

if (!user) {
   interaction.reply({
     content: `You are not in a gang`,
     ephemeral: true
   });
}
    
const gangCheck = await Gng.findOne({
    _id: user.gangId
});
    
const knife = new ButtonBuilder()
 .setLabel("Knife")
 .setCustomId("knife")
 .setStyle(ButtonStyle.Primary)

const bat = new ButtonBuilder()
 .setLabel("Baseball bat")
 .setCustomId("bat")
 .setStyle(ButtonStyle.Primary)

const glock = new ButtonBuilder()
 .setLabel("Glock 17.5mm")
 .setCustomId("glock")
 .setStyle(ButtonStyle.Primary)

const ak47 = new ButtonBuilder()
 .setLabel("Ak47")
 .setCustomId("ak47")
 .setStyle(ButtonStyle.Primary)

const bazooka = new ButtonBuilder()
 .setLabel("Bazooka")
 .setCustomId("bazooka")
 .setStyle(ButtonStyle.Primary)

const row = new ActionRowBuilder()
 .setComponents(knife, bat, glock, ak47, bazooka)
      
const emb = new EmbedBuilder()
 .setTitle("Shop")
 .setColor("121212")
 .addFields(
     { name: "Knife (10 damage)", value: "$1000" },
     { name: "Baseball bat (20 damage)", value: "$5000" },
     { name: "Glock 17.5mm (40 damage)", value: "$50000" },
     { name: "Ak47 (70 damage)", value: "$100000" },
     { name: "Bazooka (100 damage) (One time useable)", value: "$500000" }
 )
  const response = await interaction.reply({
    embeds: [emb],
    components: [row]
  });
    
  const collectorFilter = i => i.user. id === interaction.user.id;
     
  const confirmation = await response.awaitMessageComponent({
         filter: collectorFilter,
         time: 100_000,
     });
    if (confirmation.customId === "knife") {
 await Usr.updateOne({
     usedId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {$set: {
     inventory: {
         weapon: {
             knife: {
                 present: true,
                 damaged: 10
             }
         }
     }
 }
    });
        confirmation.reply({
            content: `${confirmation.user}, You bought a knife`
        });
    } else if (confirmation.customId === "bat") {
       confirmation.reply({
           content: `${confirmation.user}, You bought a Baseball bat`
       });
    } else if (confirmation.customId === "glock") {
        confirmation.reply({
            content: `${confirmation.user},You bought a Glock 17.5mm`
        });
    } else if (confirmation.customId === "ak47") {
        confirmation.reply({
            content: `${confirmation.user}, You bought an Ak47`
        });
    } else if (confirmation.customId === "bazooka") {
        confirmation.reply({
  content: `${confirmation.user}, You bought a Bazooka`
        });
}
 },
};