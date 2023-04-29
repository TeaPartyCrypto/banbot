const user_model = require('../../models/users');

module.exports = {
    name:"add",
    description: 'add username to protect',
    options:[{
      name:'username',
      description:'@ username that you want to protect from duplicates',
      type: 6,
      required:true,
    }],


    async execute(interaction,client){
      await interaction.deferReply({ ephemeral: true });
        const guildId = interaction.guild.id;
        const existingUser = await user_model.findOne({ Guild_ID: guildId, username: interaction.options.getUser("username").tag });
        if (existingUser) {
          return interaction.editReply(`<@${interaction.options.getUser("username").id}> is already added `);
        }
        
        const newUser = new user_model({
          Guild_ID: guildId,
          username: interaction.options.getUser("username").tag,
        });
        
        try {
          await newUser.save();
          interaction.editReply(`User <@${interaction.options.getUser("username").id}> has been added to the database.`);
        } catch (err) {
          console.error(err);
          interaction.editReply('Error adding user to database.');
        }


    }
}