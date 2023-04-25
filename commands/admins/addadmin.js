const admin_model = require("../../models/admin")
const {PermissionsBitField} = require('discord.js')
module.exports = {
    name:"addadmin",
    permission:PermissionsBitField.Flags.Administrator,
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
const guildId = interaction.guild.id
const role = interaction.options.getRole("role");


if(interaction.options.getMember("user") && interaction.options.getRole("role")){
    interaction.reply("Please select single option, Role or user")
}
else if(role){
let defined  = await admin_model.findOne({ Guild_ID: guildId, Role:role.id });
if (defined){
    return interaction.reply(`${role} is already set as Bot admin role`)
}
    const newRole = new admin_model({
        Guild_ID: guildId,
        Role: role,
        userid:"null",
      });
try{
    await newRole.save()
    interaction.reply(`added **${role}** Role As Bot admin`)
}catch (err) {
    console.error(err);
    interaction.reply('Error adding role to database.');
  }
}

else if(interaction.options.getMember("user")){
    let defined  = await admin_model.findOne({ Guild_ID: guildId, userid:interaction.options.getMember("user").id });
if(defined){
    return interaction.reply(`<@${interaction.options.getMember("user").id}> is already added as Bot admin`)
}
const newMember = new admin_model({
    Guild_ID: guildId,
    Role:"null",
    userid:interaction.options.getMember("user").id,
  });

  try{
    newMember.save()
    interaction.reply(`added <@${interaction.options.getMember("user").id}> as bot admin `)
} catch (err) {
    console.error(err);
    interaction.reply('Error adding user to database.');
  }
    }
}}