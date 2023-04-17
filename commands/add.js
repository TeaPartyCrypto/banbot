const user_model = require('../models/users');
const { PermissionsFlagBits } = require('discord.js');

module.exports = {
    name:"add",
    permission:'8',

    async execute(interaction,client){
        const guildId = interaction.guild.id;
        const existingUser = await user_model.findOne({ Guild_ID: guildId, username: interaction.options.getUser("username").tag });
        if (existingUser) {
          return interaction.reply('User already exists in the database.');
        }
        
        // Create new user
        const newUser = new user_model({
          Guild_ID: guildId,
          username: interaction.options.getUser("username").tag,
        });
        
        try {
          await newUser.save();
          interaction.reply(`User <@${interaction.options.getUser("username").id}> has been added to the database.`);
        } catch (err) {
          console.error(err);
          interaction.reply('Error adding user to database.');
        }


    }
}