const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");
const Wpn = require("/home/container/src/database/Weapon.js");


module.exports = {
    data: new SlashCommandBuilder()
     .setName("shop")
     .setDescription("To buy weapons"),
async execute(interaction, client) {
const user = await Usr.findOne({
   userId: interaction.user.id,
   guildId: interaction.guild.id
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
    const buttonUser = await Usr.findOne({
        userId: confirmation.user.id,
        guildId: confirmation.guild.id
    });
    const userWeapon = await Wpn.findOne({
        _id: buttonUser._id
    });
    if (confirmation.customId === "knife") {
     if (buttonUser.cash <= 1000) {
         confirmation.reply({
             content: "You don\'t have 1000 in cash"
         });
     } else {
 await Gng.updateOne({
     _id: buttonUser.gangId
 }, {
     $inc: {
         fund: -1000
     }
 });
 await Usr.updateOne({
     userId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {
     $inc: {
         cash: -1000
     }
 });
 await Wpn.updateOne({
     user: user._id
 }, {
     $inc: {
         knife: 10,
         total: 10
     },
     $push: {
         weapons: "Knife"
     }
    });
                
        confirmation.reply({
            content: `${confirmation.user}, You bought a knife`
        });
         }
    } else if (confirmation.customId === "bat") {
 if (buttonUser.cash <= 5000) {
         confirmation.reply({
             content: "You don\'t have 5000 in cash"
         });
     } else {
 await Gng.updateOne({
     _id: buttonUser.gangId
 }, {
     $inc: {
         fund: -5000
     }
 });
 await Usr.updateOne({
     userId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {
     $inc: {
         cash: -5000
     }
 });
 await Wpn.updateOne({
     user: user._id
 }, {
     $inc: {
         bat: 20,
         total: 20
     },
     $push: {
         weapons: "Baseball bat"
     }
    });
                
       confirmation.reply({
           content: `${confirmation.user}, You bought a Baseball bat`
       });
         }
    } else if (confirmation.customId === "glock") {
 if (buttonUser.cash <= 50000) {
         confirmation.reply({
             content: "You don\'t have 50000 in cash"
         });
     } else {
 await Gng.updateOne({
     _id: buttonUser.gangId
 }, {
     $inc: {
         fund: -50000
     }
 });
 await Usr.updateOne({
     userId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {
     $inc: {
         cash: -50000
     }
 });
 await Wpn.updateOne({
     user: user._id
 }, {
     $inc: {
         glock: 40,
         total: 40
     },
     $push: {
         weapons: "Glock 17.5mm"
     }
    });
                
        confirmation.reply({
            content: `${confirmation.user},You bought a Glock 17.5mm`
        });
         }
    } else if (confirmation.customId === "ak47") {
 if (buttonUser.cash <= 100000) {
         confirmation.reply({
             content: "You don\'t have 100000 in cash"
         });
     } else {
 await Gng.updateOne({
     _id: buttonUser.gangId
 }, {
     $inc: {
         fund: -100000
     }
 });
 await Usr.updateOne({
     userId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {
     $inc: {
         cash: -100000
     }
 });
 await Wpn.updateOne({
     user: user._id
 }, {
     $inc: {
         ak47: 70,
         total: 70
     },
     $push: {
         weapons: "Ak47"
     }
    });
                
        confirmation.reply({
            content: `${confirmation.user}, You bought an Ak47`
        });
         }
    } else if (confirmation.customId === "bazooka") {
 if (buttonUser.cash <= 500000) {
         confirmation.reply({
             content: "You don\'t have 500000 in cash"
         });
     } else {
 await Gng.updateOne({
     _id: buttonUser.gangId
 }, {
     $inc: {
         fund: -500000
     }
 });
 await Usr.updateOne({
     userId: confirmation.user.id,
     guildId: confirmation.guild.id
 }, {
     $inc: {
         cash: -500000
     }
 });
 await Wpn.updateOne({
     user: user._id
 }, {
     $inc: {
         bazooka: 100,
         total: 100
     },
     $push: {
         weapons: "Bazooka"
     }
    });
                
        confirmation.reply({
  content: `${confirmation.user}, You bought a Bazooka`
        });
         }
}
 },
};