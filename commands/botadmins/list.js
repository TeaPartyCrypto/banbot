const admin_model = require("../../models/admin")
const user_model = require("../../models/users")
const PermissionsBitField = require("discord.js")
const Guild_ID = process.env.GuildID
module.exports = {
    name:"list",
    description:"use to check Bot Admins or protected users",
    options:[{
      name:"type",
      description:"select list you would like to see. ",
      type:3,
      required:true,
      choices:[
        {
      name:"User",
      value:"user",
        },{
      name:"Bot Admins",
      value:"admins",
        },
]}],



async execute(interaction){
    await interaction.deferReply({ ephemeral: true });
    const permission = interaction.memberPermissions.toArray().includes(`Administrator`);

    const admin_users = await admin_model.find({ Guild_ID: Guild_ID, Role:"null"});
    const admin_roles = await admin_model.find({ Guild_ID: Guild_ID, userid:"null"});
    const p_users = await user_model.find({ Guild_ID: Guild_ID,})
  if (interaction.options.getString('type') === "admins"){
            if(permission){
                let botAdminsString = "**Bot Admins:**\n*Users:*\n"
                if(admin_users && admin_roles){
                for (const admin of admin_users) {
                  botAdminsString += `<@${admin.userid}>` + ",\n"
                }
                botAdminsString += `*Roles:*\n` 
                for (const admin of admin_roles) {
                  botAdminsString += `<@&${admin.Role}>` + ",\n"
                    }
              interaction.editReply({content:`${botAdminsString}`, ephemeral: true})
              }

                }else {
                    interaction.editReply({content:`You do not have permission to access this command`,ephemeral:true})
                }

    }
    
    if (interaction.options.getString('type') === "user"){
        let usernames = "**Protected Users:**\n";
p_users.forEach(user => {
  usernames += user.username + ", \n";
});
usernames = usernames.slice(0, -2);
interaction.editReply({content:`${usernames}`})
    }

    
}
}