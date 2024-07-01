const {
     SlashCommandBuilder,
     ButtonBuilder,
     ActionRowBuilder,
     ComponentType,
     ButtonStyle
} = require("discord.js");
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = {
   data: new SlashCommandBuilder()
    .setName("transfer-ownership")
    .setDescription("Transfer the ownership of your gang to someone")
   .addUserOption(option => option
                  .setName("user")
                  .setDescription("The user you want to transfer ownership to")
                 .setRequired(true)),
async execute(interaction, client) {
const userGet = interaction.options.getUser("user");

const gangCheck = await Gng.findOne({
   leader: interaction.user.id,
   local: interaction.guild.id
});

if (!gangCheck) {
    interaction.reply({
       content: "You are not a gang leader",
       ephemeral: true
    });
}

if (userGet.bot) {
    interaction.reply({
        content: "You cannot transfer ownership of your gang to a bot",
        ephemeral: true
    });
}
    
    
const userCheck = await Usr.findOne({
    userId: userGet.id,
    guildId: interaction.guild.id,
});
    
if (gangCheck.leader === userGet.id) {
    interaction.reply({
        content: "Don\'t mention yourself",
        ephemeral: true
    })
}

if (userCheck.gangId !== gangCheck._id) {
    interaction.reply({
      content: `${userGet} is not in your gang`,
      ephemeral: true
    });
}

const confirmBtn = new ButtonBuilder()
    .setLabel("Confirm")
    .setCustomId("confirm")
    .setStyle(ButtonStyle.Primary)

const cancelBtn = new ButtonBuilder()
    .setLabel("Cancel")
    .setCustomId("cancel")
    .setStyle(ButtonStyle.Danger)

const row = new ActionRowBuilder()
    .addComponents(confirmBtn, cancelBtn)

const response = await
interaction.reply({
    content: `Are you sure that you want to transfer the ownership of your gang to ${userGet}`,
    components: [row],
    ephemeral: true
});
    
const collectorFilter = i => i.user.id = interaction.user.id;
     
    const confirmation = await response.awaitMessageComponent({
         filter: collectorFilter,
         time: 300_000,
         max: 1,
     });
 if (confirmation.customId === "confirm") {
    if (!userCheck) {
        confirmation.reply({
            content: `${userGet} is not in your gang`,
            ephemeral: true
        });
    }
    if (!gangCheck) {
        confirmation.reply({
            content: "You are not a gang leader",
            ephemeral: true
        });
    }
     
     const confirmDis = confirmBtn.setDisabled(true)
const cancelDis =   cancelBtn.setDisabled(true)

const updatedRow = new ActionRowBuilder()
.setComponents(confirmDis, cancelDis)

await confirmation.update({
    content: confirmation.content,
    components: [updatedRow]
});
     
    confirmation.channel.send({
         content: `${confirmation.user}, You successfully transfered your ownership to ${userGet}`,
     });

await Gng.updateOne({
  leader: confirmation.user.id,
  local: confirmation.guild.id
}, {
    $set: {
        leader: userGet.id
    },
    $push: {
        member: confirmation.user.id
    },
    $pull: {
        coLeader: userGet.id,
        elite: userGet.id,
    }
});
await Usr.updateOne({
    userId: userGet.id,
    guildId: confirmation.guild.id,
    gangId: gangCheck._id
}, {
    role: "Leader"
});
     
await Usr.updateOne({
    userId: confirmation.user.id,
    guildId: confirmation.guild.id,
}, {
    role: "Member"
});
} else if (confirmation.customId === "cancel") {
      
const confirmDis = confirmBtn.setDisabled(true)
const cancelDis =   cancelBtn.setDisabled(true)

const updatedRow = new ActionRowBuilder()
.setComponents(confirmDis, cancelDis)
     
await confirmation.update({
    content: confirmation.content,
    components: [updatedRow]
});
         confirmation.channel.send({
             content: "You canceled the transfer of ownership",
             ephemeral: true
         });
     }
},
};
