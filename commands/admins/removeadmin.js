const admin_model = require('../../models/admin')
module.exports = {
    name:"removeadmin",
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
      await interaction.deferReply({ ephemeral: true });
        const guildId = interaction.guild.id
        const role = interaction.options.getRole("role");
        const selection = interaction.options.getMember("user") && interaction.options.getRole("role")
        if(selection){
            interaction.editReply({content:"Please select single option, Role or user",ephemeral:true})
        }
        if(role){
            admin_model.findOneAndDelete({ Role: role.id })
  .then((admin) => {
    if (!admin) {
      interaction.editReply({content:`${role} role does not exist `,ephemeral:true});
    } else {
interaction.editReply({content:`${role} Deleted from admin`,ephemeral:true})    }
  })
  .catch((err) => {
    console.log('Error deleting admin:', err);
  });
        }
        
         if(interaction.options.getMember("user")){
            let defined  = await admin_model.findOneAndDelete({ Guild_ID: guildId, userid:interaction.options.getMember("user").id });
        if(defined){
            return interaction.editReply({content:`<@${interaction.options.getMember("user").id}> removed from admin List`,ephemeral:true})
        }else {
            interaction.editReply({content:`${interaction.options.getMember("user")} User not found`,ephemeral:true})
        }
        
            }
        }}