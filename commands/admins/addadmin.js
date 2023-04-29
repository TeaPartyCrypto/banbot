const admin_model = require("../../models/admin")
module.exports = {
    name:"addadmin",
    description: 'add role or user as bot admin',
    options:[{
          name:'user',
          description:'use @user to add an user',
          type: 6,
          required:false,
        },{
            name:'role',
            description:'use @role to add role as bot admin ',
            type: 8,
            required:false,
          }],


    async execute(interaction){
await interaction.deferReply({ ephemeral: true });
const guildId = interaction.guild.id
const role = interaction.options.getRole("role");


if(interaction.options.getMember("user") && interaction.options.getRole("role")){
    interaction.editReply("Please select single option, Role or user")
}
else if(role){
let defined  = await admin_model.findOne({ Guild_ID: guildId, Role:role.id });
if (defined){
    return interaction.editReply(`${role} is already set as Bot admin role`)
}
    const newRole = new admin_model({
        Guild_ID: guildId,
        Role: role.id,
        userid:"null",
      });
try{
    await newRole.save()
    interaction.editReply(`added **${role}** Role As Bot admin`)
}catch (err) {
    console.error(err);
    interaction.editReply('Error adding role to database.');
  }
}

else if(interaction.options.getMember("user")){
    let defined  = await admin_model.findOne({ Guild_ID: guildId, userid:interaction.options.getMember("user").id });
if(defined){
    return interaction.editReply(`<@${interaction.options.getMember("user").id}> is already added as Bot admin`)
}
const newMember = new admin_model({
    Guild_ID: guildId,
    Role:"null",
    userid:interaction.options.getMember("user").id,
  });

  try{
    newMember.save()
    interaction.editReply(`added <@${interaction.options.getMember("user").id}> as bot admin `)
} catch (err) {
    console.error(err);
    interaction.editReply('Error adding user to database.');
  }
    }
}}