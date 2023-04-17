require("dotenv").config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const commands = [
  {
    name: 'add',
    description: 'add username to protect',
    options:[{
      name:'username',
      description:'@ username that you want to protect from duplicates',
      type: 6,
      required:true,
    }]
  }, {
    name: 'botadmin',
    description: 'use this command to add bot admins ',
    options:[{
      name:'username',
      description:'@ username that you want to add as bot Admin',
      type: 6,
      required:true,
    }]
  },
  {
    name: 'interval',
    description: 'Chose interval for checks',
    options:[{
      name:'time',
      description:'use time formats, like 30s,1m,1h ',
      type: 3,
      required:true,
    }]
  },

];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.ClientID,
        process.env.GuildID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
