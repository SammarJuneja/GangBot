const {
      ActionRowBuilder,
      StringSelectMenuBuilder,
      StringSelectMenuOptionBuilder,
      SlashCommandBuilder,
      ComponentType
} = require('discord.js');
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
   data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work every 24 hours to earn money"),
async execute(interaction, client) {
   const author = interaction.user
   const user = await Usr.findOne({
       userId: interaction.user.id,
       guildId: interaction.guild.id
   });
  if (!user.profession) {
   const select = new StringSelectMenuBuilder()
    .setCustomId('starter')
    .setPlaceholder('Make a selection!')

.addOptions(
   new StringSelectMenuOptionBuilder()
    .setLabel("Mechanic")
    .setDescription("Being a Mechanic gives your advantage in stealing vehicles")
    .setEmoji("👨‍🔧")
    .setValue("mechanic"),

   new StringSelectMenuOptionBuilder()
    .setLabel("Mercenary")
    .setDescription("Being a Mercenary gives you access to more weapons")
    .setEmoji("🔫")
    .setValue("mercenary"),

   new StringSelectMenuOptionBuilder()
    .setLabel("Accountant")
    .setDescription("Being an Accountant gives you an upper place in gang")
    .setEmoji("💰")
    .setValue("accountant"),

   new StringSelectMenuOptionBuilder()
    .setLabel("Marketing agent")
    .setDescription("Being a Marketing agent gives you more money when you join a gang")
    .setEmoji("📢")
    .setValue("marketing"),
);

   const row = new ActionRowBuilder()
    .addComponents(select);

   const response = await interaction.reply({
     content: "Choose your job!",
     components: [row],
   });
     
   const collector = response.createMessageComponentCollector({
       componentType: ComponentType.StringSelect,
       time: 30_000,
   });
     
collector.on("collect", async (int) => {
   if (int.user.id !== author.id) {
       int.reply({
           content: `${int.user} You cannot use that`,
           ephemeral: true
       });
   } else {
   const selection = int.values[0];
    if (selection === "mechanic") {
        await Usr.updateOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        }, {$set: {
            profession: "Mechanic"
        }
           });
        int.update({
            content: `${author}, You successfully became a Mechanic`,
            components: []
        });
    } else if (selection === "mercenary") {
        await Usr.updateOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        }, {$set: {
            profession: "Mercenary"
        }
           });
        int.update({
            content: `${author}, You successfully became a Mercenary`,
            components: []
        });
    } else if (selection === "accountant") {
        await Usr.updateOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        }, {$set: {
            profession: "Accountant"
        }
           });
        int.update({
            content: `${author}, You successfully became an Accountant`,
            components: []
        });
    } else if (selection === "marketing") {
        await Usr.updateOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        }, {$set: {
            profession: "Marketing agent"
        }
           });
        int.update({
            content: `${author}, You successfully became a Marketing agent`,
            components: []
        });
    }
   }
    });
      } else {
 const gang = await Gng.findOne({
     _id: user.gangId
 });
 const random = Math.floor(Math.random() * 5000);
      if (!gang) {
          await Usr.updateOne({
              userId: interaction.user.id,
              guildId: interaction.guild.id
          }, {$inc: {
              cash: random
          }
             });
      } else {
          await Usr.updateOne({
              userId: interaction.user.id,
              guildId: interaction.guild.id
          }, {$inc: {
              cash: random
          }
             });
          await Gng.updateOne({
              _id: gang._id
          }, {$inc: {
              fund: random
          }
          });
          }
          interaction.reply({
              content: `You worked as a ${user.profession} and earned ${random}`
          });
      }
 },
};