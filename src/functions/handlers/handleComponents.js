const fs = require('fs');

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentsFolders = fs.readdirSync('./src/components');

for (const folder of componentsFolders) {
	const componentsFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith('.js'));
    
    const { modals, buttons } = client;

  switch (folder) {
    case "modals":
for (const file of componentsFiles) {
		const modal = require(`../../components/${folder}/${file}`);
    modals.set(modal.data.name, modal);
		}
      break;
    default:
      break;
  }
}
    }
}
