const {REST, Routes  } = require('discord.js');

async function registerCommands(client,guildId) {
    const data = [];
    client.commands.forEach(command => {
      const commandObject = {
        name: command.name,
        description:command.description,
        options: command.options || null
      };
      data.push(commandObject);
    });
    
    
      const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
            try {
               await rest.put(Routes.applicationGuildCommands(
                process.env.ClientID,
                guildId),
                { body: data });
              console.log(`Commands is registered`);
            } catch (error) {
              console.error(error);
            }  }
  
  module.exports = registerCommands;