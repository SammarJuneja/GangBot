const { SlashCommandBuilder} = require("discord.js");
const db = require("mongoose");
const Gng = require("../../database/CreateGang");
const Usr = require("../../database/User");
const Wpn = require("../../database/Weapon");


module.exports = {
  data: new SlashCommandBuilder()
   .setName("kidnap")
   .setDescription("Kidnap member of a gang")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The member you want to kidnap")
        .setRequired(true)),
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
    
if (JSON.stringify(user.kidnapped)) {
    return interaction.reply({
        content: "You are kidnapped dumbass, you can\'t kidnap others"
    });
}

const mentionedUser = await Usr.findOne({
   userId: userGet.id,
   guildId: interaction.guild.id
});

if (!JSON.stringify(mentionedUser.gangId)) {
   return interaction.reply({
       content: `${userGet} is not in a gang`,
       ephemeral: true
   });
}
    
if (JSON.stringify(mentionedUser.kidnapped) === true) {
    return interaction.reply({
        content: `${userGet} is are kidnapped`
    });
}

const gangCheck = await Gng.findOne({
   _id: user.gangId
});

const mentionedUserGang = await Gng.find({
   _id: mentionedUser.gangId
});
    
if (JSON.stringify(user.gangId) === JSON.stringify(mentionedUser.gangId)) {
    return interaction.reply({
        content: "Are you trying to snitch by kidnapping your own gang member?"
    });
}
    
const userWeapon = await Wpn.findOne({
   user: user._id
});
  
const mentionedWeapon = await Wpn.findOne({
   user: mentionedUser._id
});
    
console.log(userWeapon, mentionedWeapon)

if (userWeapon.total < mentionedWeapon.total) {
   interaction.reply({
     content: `You tried to kidnap \`${userGet.username}\`, but they defeated you using their weapons`
   });
} else if (userWeapon.total > mentionedWeapon.total) {
   await Usr.updateOne({
     userId: userGet.id,
     guildId: userGet.id,
     gangId: mentionedUser.gangId
   }, {$set: {
         kidnapped: true
       }
      });
   await Usr.updateOne({
     userId: interaction.user.id,
     guildId: interaction.guild.id,
   }, {$push: {
         poccess: userGet.id
       }
      });
   interaction.reply({
     content: `You successfully kidnapped ${userGet}`
   });
} else if (userWeapon.total === mentionedWeapon.total) {
   const random = Math.floor(Math.random() * 10);
     if (random > 5) {
        await Usr.updateOne({
          userId: userGet.id,
          guildId: interaction.guild.id
        }, {$set: {
              kidnapped: true
            }
        });
        await Usr.updateOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id
        }, {$push: {
              poccess: userGet.id
            }
        });
         
        interaction.reply({
     content: `${interaction.user} and ${userGet} had a furious battle and ${interaction.user} won, {$userGet} is now kidnapped by ${interaction.user}`
        });
     } else {
        await Usr.updateOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id
        }, {$set: {
              kidnapped: true
            }
        });
        await Usr.updateOne({
          userId: userGet.id,
          guildId: interaction.guild.id
        }, {$push: {
              poccess: interaction.guild.id
            }
        });
         
        interaction.reply({
     content: `${userGet} and ${interaction.user}had a furious battle and ${userGet} won, ${interaction.user} is now kidnapped by ${userGet}`
        });
     }
   }
 },
};
