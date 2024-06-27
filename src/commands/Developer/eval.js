const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const owners = [
    "670249406527963147",
    "1077766221929402378",
    "1036685598938894388",
    "696368083517964288",
    "548419804147613717",
    "631721449140518912",
    "800322387060195339",
    "1221719516606894142",
    "656762869043691530",
    "661566131383042078",
    "809154351951380520"
];
const Gng = require("/home/container/src/database/CreateGang.js");
const Usr = require("/home/container/src/database/User.js");

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate the code')
        .addStringOption(option => option.setName('input')
            .setDescription('The input to eval')
            .setRequired(true)),
    async execute(interaction, client) { 
        let t = interaction.options.getString('input') 
        if (owners.includes(interaction.user.id)) { 
            try { 
                let smh = await eval(t) 
                let u = typeof smh; 
                
                if (u == "object") 
                    smh = require('util').inspect(smh, { depth: 0 }); 
                
                t = t.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `\@${String.fromCharCode(8203)}`) 
                
                let embed = new EmbedBuilder() 
                    .setTitle('Eval') 
                    .setColor(0x0099ff) 
.setDescription(` 
 **Input:**
\`\`\`js
${t}
\`\`\` 
**Output:**
\`\`\`js
${String(smh).replace('OTM2NzEwNjcxMDcxMDgwNTMw.GCmgeV.cyDgtjc6uYaEnPNvpE26EVdiNAhZDa5HCvVKwk', '[CLIENT TOKEN]')}
\`\`\` 
**TypeOf:**
\`\`\`js
${u}
\`\`\` `); 
                
                await interaction.reply({embeds: [embed]}); 
            } catch (error) { 
                let type = typeof error; 
                
                let err = new EmbedBuilder() 
.setColor(0xff3300) 
.setDescription(` 
**Input:**
\`\`\`js
${t}
\`\`\` 
**Output:**
\`\`\`js
${error.name}: ${error.message}
\`\`\` 
**TypeOf:**
\`\`\`js
${type}
\`\`\` `) 
.setTitle('Error'); 
                
await interaction.reply({embeds: [err]}); 
            } 
        } else {
            interaction.reply({
                content: "You cannot use this command",
                ephemeral: true
            });
        }
    } 
}; 
