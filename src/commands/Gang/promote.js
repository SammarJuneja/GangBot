const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  ComponentType,
} = require('discord.js');
const Usr = require('/home/container/src/database/User.js');
const Gng = require('/home/container/src/database/CreateGang.js');

module.exports = {
  cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('promote')
		.setDescription('Promote your gang member to upper roles')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user you want to promote')
				.setRequired(true),
		),
  async execute(interaction, client) {
    const autherInfo = await Usr.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id
    });

    if (!autherInfo.gangId) {
      return interaction.reply({
        content: "You aren't currently in a gang",
        ephemeral: true
      });
    }

    if (['Leader', 'Co Leader'].includes(autherInfo.role)) { // allowed to cook
      const user = interaction.options.getUser("user");
      if (user.bot) {
        return interaction.reply({
          content: "Bots aren't a part of any gangs",
          ephemeral: true
        });
      }

      if (interaction.user.id === user.id) {
        return interaction.reply({
          content: `You can't use /promote on yourself dumbass`
        })
      }
      
      const userInfo = await Usr.findOne({
        userId: user.id,
        gangId: autherInfo.gangId,
        guildId: interaction.guild.id
      });

      if (!userInfo) {
        return interaction.reply({
          content: `${user} is not in your gang`,
          ephemeral: true
        })
      }

      if (autherInfo.role === 'Leader') {
        if (userInfo.role === 'Co Leader') {
          return interaction.reply({
            content: `${userInfo} is already a \`Co Leader\` dawg`,
            ephemeral: true
          });
        } else if (userInfo.role === 'Elite') {
          userInfo.role = 'Co Leader';
          userInfo.save();

          const data = await Gng.findByIdAndUpdate(autherInfo.gangId, {
            $pull: {
              elite: user.id
            },
            $push: {
              coLeader: user.id
            }
          });

          if (!data) {
            return interaction.reply({
              content: `Something went wrong, please reach out to our support team`,
              ephemeral: true
            });
          } else {
            return interaction.reply({
              content: `You successfully demoted ${user.username} to \`Member\``
            });
          }
        } else {
          const menu = new StringSelectMenuBuilder()
          .setCustomId('promote')
          .setPlaceholder('Select the role you want the user to be demoted to')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('Co Leader')
              .setValue('Co_Leader'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Elite')
              .setValue('Elite'),
          );

          const row = new ActionRowBuilder()
            .addComponents(menu);

          const response = await
          interaction.reply({
            content: `Promote ${user} to:`,
            components: [row],
          });

          const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 30_000,
          });

          collector.on('collect', async (int) => {
            const tempAutherInfo = await Usr.findOne({
              userId: interaction.user.id,
              guildId: interaction.guild.id
            });

            const tempUserInfo = await Usr.findOne({
              userId: user.id,
              gangId: autherInfo.gangId,
              guildId: interaction.guild.id
            });

            if (!tempAutherInfo) {
              return int.reply({
                content: `you are no longer a gang member`
              })
            }

            if (!tempUserInfo) {
              return int.reply({
                content: `That gangster is no longer in the gang`
              })
            }

            if (tempAutherInfo.role === autherInfo.role) {
              return int.reply({
                content: `Your role has been changed, re-run the command`
              })
            }

            if (tempUserInfo.role === userInfo.role) {
              return int.reply({
                content: `${user}'s role has been changed, re-run the command`
              })
            }

            const selection = int.values[0];
            
            userInfo.role = selection.replace('_', ' ');
            userInfo.save();

            if (selection === 'Co_Leader') {
              const data = await Gng.findByIdAndUpdate(autherInfo.gangId, {
                $pull: {
                  member: user.id
                },
                $push: {
                  coLeader: user.id
                }
              });

              if (!data) {
                return interaction.reply({
                  content: `Something went wrong, please reach out to our support team`,
                  ephemeral: true
                });
              } else {
                return interaction.reply({
                  content: `You successfully promoted ${user.username} to \`Member\``
                });
              }
            } else {
              const data = await Gng.findByIdAndUpdate(autherInfo.gangId, {
                $pull: {
                  member: user.id
                },
                $push: {
                  elite: user.id
                }
              });

              if (!data) {
                return interaction.reply({
                  content: `Something went wrong, please reach out to our support team`,
                  ephemeral: true
                });
              } else {
                return interaction.reply({
                  content: `You successfully promoted ${user.username} to \`Elite\``
                });
              }
            }
          });
        }
      } else if (autherInfo.role === 'Co Leader') {
        switch (userInfo.role) {
          case 'Leader': {
            return interaction.reply({
              content: `You have just promoted the-... leader? How did you do that?`,
              ephemeral: true
            });
          }
          case 'Co Leader': {
            return interaction.reply({
              content: `You don't have enough power to promote a college`,
              ephemeral: true
            });
          }
          case 'Elite': {
            return interaction.reply({
              content: `You don't have enough power to promote an Elite`,
              ephemeral: true
            });
          }
          case 'Member': {
            userInfo.role = 'Elite';
            userInfo.save();

            const data = await Gng.findByIdAndUpdate(autherInfo.gangId, {
              $pull: {
                member: user.id
              },
              $push: {
                elite: user.id
              }
            });

            if (!data) {
              return interaction.reply({
                content: `Something went wrong, please reach out to our support team`,
                ephemeral: true
              });
            } else {
              return interaction.reply({
                content: `You successfully promoted ${user.username} to \`Elite\``
              });
            }
          }
        }
      }
    } else {
      return interaction.reply({
        content: `You are not a higher up in a gang`,
        ephemeral: true
      })
    }
  },
};
