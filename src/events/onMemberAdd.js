const { Events } = require('discord.js');
const Gng = require("../database/CreateGang");
const Usr = require("../database/User");

module.exports = {
	name: Events.GuildMemberAdd,
async execute(interaction, client) {
    const user = new Usr({
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        gangId: null,
        role: "Civilian",
        cash: 0,
        wallet: 0,
        kidnapped: false,
        profession: null,
        health: 100
    });
    user.save()
   const weapon = new Wpn({
       user: user._id,
       knife: 0,
       bat: 0,
       glock: 0,
       ak47: 0,
       bazooka: 0,
       total: 0
   });
    weapon.save()
},
};
    