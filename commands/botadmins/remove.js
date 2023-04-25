const {PermissionsBitField} = require('discord.js')
const user_model = require(`../../models/users`)
module.exports = {
    name:"remove",
    permission:PermissionsBitField.Flags.SendMessages,
    description: 'Remove user from protected list ',
    options:[{
      name:'username',
      description:'use @user to remove user from Protected list ',
      type: 6,
      required:true,
    }],

    async execute(interaction,client){
        await interaction.deferReply({ ephemeral: true });
        const guildId = interaction.guild.id

        if(interaction.options.getUser("username")){
            let defined  = await user_model.findOneAndDelete({ 
                Guild_ID: guildId, 
                username:interaction.options.getUser("username").tag});
        if(defined){
            return interaction.editReply(`<@${interaction.options.getUser("username").id}> Removed from protected list `)
        }else {
            interaction.editReply(`<@${interaction.options.getUser("username").id}> he/she was not protected`)
        }
        
            }
}
}