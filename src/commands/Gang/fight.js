const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
    data: new SlashCommandBuilder()
   .setName("fight")
   .setDescription("Fight a member of another gang")
   .addUserOption(option => option
        .setName("user")
        .setDescription("The user you want to fight with")
        .setRequired(true)),
 async execute(interaction, client) {
   const userGet = interaction.options.getUser("user");

   const user = await Usr.findOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   });

   const mentionedUser = await Usr.findOne({
     userId: userGet.id,
     guildId: interaction.guild.id
   });

   if (!user.gangId) {
      interaction.reply({
         content: `You aren't in a gang`,
         ephemeral: true
      });
   }

   if (!mentionedUser.gangId) {
      interaction.reply({
         content: `\`${userGet.username}\` isn't in a gang`,
         ephemeral: true
      });
   }

   if (user.gangId.equals(mentionedUser.gangId)) {
     interaction.reply({
        content: "Are you trying to fight you own gang member?",
        ephemeral: true
     });
   }
     
   const accept = new ButtonBuilder()
    .setLabel("Accept")
    .setCustomId("accept")
    .setStyle(ButtonStyle.Primary)
   
   const reject = new ButtonBuilder()
    .setLabel("Reject")
    .setCustomId("reject")
    .setStyle(ButtonStyle.Danger)
   
   const requestRow = new ActionRowBuilder()
    .addComponents(accept, reject)
   
     
   const fightRequest = await interaction.reply({
       content: `${userGet}, ${interaction.user} has challenged you to a fight`,
       components: [requestRow]
   });
     
   const requestCollector = await fightRequest.ceateMessageComponentCollector({ time: 30_000 });
     
    requestCollector.on("collect", async confirmation => {
        if (confirmation.customId === "accept") {
        interaction.editReply({
            content: `${userGet} accepted your request`,
            components: []
        });
        } else if (confirmation.customId === "reject") {
            interaction.editReply({
            content: `${userGet} rejected your request`,
            components: []
        });
            }
    });
       
   const fighters = [ `${interaction.user.id}`, `${userGet.id}` ];
/*
   const bat = new ButtonBuilder()
      .setLabel("Bat")
      .setCustomId("bat")
      .setStyle(ButtonStyle.Danger)

   const knife = new ButtonBuilder()
      .setLabel("Knife")
      .setCustomId("knife")
      .setStyle(ButtonStyle.Danger)

   const glock = new ButtonBuilder()
      .setLabel("Glock")
      .setCustomId("Glock")
      .setStyle(ButtonStyle.Danger)

   const ak47 = new ButtonBuilder()
      .setLabel("AK47")
      .setCustomId("ak47")
      .setStyle(ButtonStyle.Danger)

   const bazooka = new ButtonBuilder()
      .setLabel("Bazooka")
      .setCustomId("bazooka")
      .setStyle(ButtonStyle.Danger)

   const row = new ActionRowBuilder()
      .addComponents(bat, knife, glock, ak47, bazooka)
      
   const emb = new EmbedBuilder()
      .setTitle(`Fight between ${interaction.user} and ${userGet}`)
      .addFields(
        {
            name: `${interaction.user} health`,
            value: `${user.health}`
        },
        {
            name: `${userGet} health`,
            value: `${mentionedUser.health}`
        },
      )
      .setColor("121212")
      .setTimestamp()

   const response = await interaction.reply({
      embeds: [emb],
      components: [row]
   });
       
   const collector = await response.createMessageComponentCollector({
         time: 30_000,
   });
     
collector.on("collect", async confirmation => {
if (confirmation.customId === "bat") {
    if (!fighters.includes(confirmation.user.id)) {
        confirmation.reply({
            content: "You cannot interfere in their fight",
            ephemeral: true
        });
    }
    if (confirmation.user.id === fighters[0]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[0]}> hit <@${fighters[1]}> with a Bat (-10 health <@${fighters[1]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[0]}> won this fight`
         });
        }
    } else if (confirmation.user.id === fighters[1]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[1]}> hit <@${fighters[0]}> with a Bat (-10 health <@${fighters[0]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[1]}> won this fight`
         });
        }
    }
} else if (confirmation.customId === "knife") {
    if (!fighters.includes(confirmation.user.id)) {
        confirmation.reply({
            content: "You cannot interfere in their fight",
            ephemeral: true
        });
    }
    if (confirmation.user.id === fighters[0]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[0]}> hit <@${fighters[1]}> with a Knife (-20 health <@${fighters[1]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[0]}> won this fight`
         });
        }
    } else if (confirmation.user.id === fighters[1]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[1]}> hit <@${fighters[0]}> with a Knife (-20 health <@${fighters[0]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[1]}> won this fight`
         });
        }
    }
} else if (confirmation.customId === "glock") {
    if (!fighters.includes(confirmation.user.id)) {
        confirmation.reply({
            content: "You cannot interfere in their fight",
            ephemeral: true
        });
    }
    if (confirmation.user.id === fighters[0]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[0]}> hit <@${fighters[1]}> with a Glock (-40 health <@${fighters[1]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[0]}> won this fight`
         });
        }
    } else if (confirmation.user.id === fighters[1]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[1]}> hit <@${fighters[0]}> with a Glock (-40 health <@${fighters[0]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[1]}> won this fight`
         });
        }
    }
} else if (confirmation.customId === "ak47") {
    if (!fighters.includes(confirmation.user.id)) {
        confirmation.reply({
            content: "You cannot interfere in their fight",
            ephemeral: true
        });
    }
    if (confirmation.user.id === fighters[0]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[0]}> hit <@${fighters[1]}> with a AK47 (-70 health <@${fighters[1]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[0]}> won this fight`
         });
        }
    } else if (confirmation.user.id === fighters[1]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[1]}> hit <@${fighters[0]}> with a AK47 (-70 health <@${fighters[0]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[1]}> won this fight`
         });
        }
    }
} else if (confirmation.customId === "bazooka") {
    if (!fighters.includes(confirmation.user.id)) {
        confirmation.reply({
            content: "You cannot interfere in their fight",
            ephemeral: true
        });
    }
    if (confirmation.user.id === fighters[0]) {
        if (user.health <= 0) {
        confirmation.reply({
            content: `<@${fighters[0]}> hit <@${fighters[1]}> with a Bazooka (-100 health <@${fighters[1]}>)`
        });
        } else {
         confirmation.reply({
             content: `<@${fighters[0]}> won this fight`
         });
        }
    } else if (confirmation.user.id === fighters[1]) {
        if (user.health <= 0) {
            confirmation.reply({
                content: `<@${fighters[1]}> hit <@${fighters[0]}> with a Bazooka (-100 health <@${fighters[0]}>)`
            });
        } else {
            confirmation.reply({
             content: `<@${fighters[1]}> won this fight`
         });
        }
    }
}
    });*/
 },
};
