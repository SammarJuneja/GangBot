const {
    SlashCommandBuilder
} = require("discord.js");
const db = require("mongoose");
const Gng = require("../../database/CreateGang");
const Usr = require("../../database/User");
const Wpn = require("../../database/Weapon");

module.exports = {
  data: new SlashCommandBuilder()
   .setName("rob")
   .setDescription("Rob members of other gang")
   .addUserOption(option => option
                 .setName("user")
                 .setDescription("User you want to rob")),
 async execute(interaction, client) {
   const userGet = interaction.options.getUser("user");
   const user = await Usr.findOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id
   });


if (!JSON.stringify(user.gangId)) {
   return interaction.reply({
       content: `You are not in a gang`,
       ephemeral: true
   });
}

const mentionedUser = await Usr.findOne({
   userId: userGet.id,
   guildId: interaction.guild.id
});

const gangCheck = await Gng.findOne({
   _id: user.gangId
});

const mentionedUserGang = await Gng.find({
   _id: mentionedUser.gangId
});
    
if (JSON.stringify(user.gangId) === JSON.stringify(mentionedUser.gangId)) {
    return interaction.reply({
        content: "Are you trying to snitch by rob your own gang member?"
    });
}
    
const userWeapon = await Wpn.findOne({
   user: user._id
});
  
const mentionedWeapon = await Wpn.findOne({
   user: mentionedUser._id
});
     
const randomMoney = Math.floor(Math.random() * mentionedUser.cash);
     
if (randomMoney <= 0) {
    interaction.reply({
        content: `\`${userGet.username}\` don't have any cash`
    });
}
     
const random = Math.floor(Math.random * 10);
     
if (random > 5) {
    interaction.reply({
        content: `You successfully robbed ${randomMoney} from ${userGet}`
    });
    await Usr.updateOne({
     userId: userGet.id,
     guildId: userGet.id,
     gangId: mentionedUser.gangId
   }, {$inc: {
         money: -random
       }
      });
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id,
   }, {$inc: {
         money: random
       }
      });
} else {
    const userMoney = Math.floor(Math.random() * user.cash);
    if (userMoney <= 0) {
        interaction.reply({
            content: `You failed to rob \`${userGet.username}\``
        });
    } else {
    interaction.reply({
        content: `You tried to rob ${userGet}, but their gang members saved them and robbed you instead`
    });
    await Usr.updateOne({
     userId: userGet.id,
     guildId: userGet.id,
     gangId: mentionedUser.gangId
   }, {$inc: {
         money: userMoney
       }
      });
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id,
   }, {$inc: {
         money: -userMoney
       }
      });
        }
}
 },
};