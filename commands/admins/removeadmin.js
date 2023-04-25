const {PermissionsBitField} = require('discord.js')
const admin_model = require('../../models/admin')
module.exports = {
    name:"removeadmin",
    permission:PermissionsBitField.Flags.Administrator,
    description: 'remove role or user as bot admin',
    options:[{
      name:'user',
      description:'use @user to remove an user',
      type: 6,
      required:false,
    },{
      name:'role',
      description:'use @role to remove role as bot admin ',
      type: 8,
      required:false,
    }],


    async execute(interaction){
        const guildId = interaction.guild.id
        const role = interaction.options.getRole("role");
        
        if(interaction.options.getMember("user") && interaction.options.getRole("role")){
            interaction.reply({content:"Please select single option, Role or user",ephemeral:true})
        }else {
            interaction.reply({content:"Please select role or user",ephemeral:true})
        }
        if(role){
            admin_model.findOneAndDelete({ Role: role.id })
  .then((admin) => {
    if (!admin) {
      interaction.reply(`${role} Admin not found.`);
    } else {
interaction.reply(`<@&${role}> Deleted from admin`)    }
  })
  .catch((err) => {
    console.log('Error deleting admin:', err);
  });
        }
        
         if(interaction.options.getMember("user")){
            let defined  = await admin_model.findOneAndDelete({ Guild_ID: guildId, userid:interaction.options.getMember("user").id });
        if(defined){
            return interaction.reply(`<@${interaction.options.getMember("user").id}> removed from admin List`)
        }else {
            interaction.reply("This user is not set as bot admin")
        }
        
            }
        }}