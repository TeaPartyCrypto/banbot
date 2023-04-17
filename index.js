const { Client, GatewayIntentBits,Events,Collection,Permissions } = require('discord.js');
require("dotenv").config();
const fs = require('fs');
const mongoose = require('mongoose')


const interval_model = require('./models/interval');
const user_model = require("./models/users")
const warning_model = require("./models/warning")


const unicode = require('./utils/unicode')
const detectedNames = require('./utils/detection')

const Guild_ID = process.env.GuildID


const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      ]});
      
client.commands = new Collection();


  fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    });
  });

 client.on(Events.InteractionCreate,
  async interaction => {
    if (!interaction.isChatInputCommand()) return;
      const commandName = interaction.commandName;
      const command = client.commands.get(commandName);
      if (!command) return;
      if (interaction.member.permissions.has(command.permission)){
        command.execute(interaction,client)
      }else {
        interaction.reply({content:"you are not allowed to use this command",ephemeral:true})
      }
     
  })
client.on('ready', async (client) => {
console.log(`Logged in as ${client.user.tag}!`);
const guild = client.guilds.cache.get(Guild_ID);
let res = await guild.members.fetch();
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MANGODB_URI,{
  keepAlive:true,
}).then(() => {
  console.log('Connected to DataBase')
})

// Get the initial interval value from the database
const intervalData = await interval_model.findOne({ Guild_ID: Guild_ID });
let interval = intervalData.Time;

// Listen for changes to the interval_model collection
interval_model.watch().on('change', async (data) => {
    // Get the new interval value from the database
    const updatedIntervalData = await interval_model.findOne({ Guild_ID: Guild_ID });
    clearInterval(Check_interval);
    interval = updatedIntervalData.Time;
    Check_interval = setInterval(async () => {
      samename();
    }, interval);
    
});
async function handleUser(userId) {
  const warning = await warning_model.findOne({ Guild_ID: Guild_ID, userID: userId }); // check if user exists in database
 
  if (!warning) { 
    const new_user = new warning_model({
      Guild_ID: Guild_ID,
      userID: userId,
        });
    await new_user.save();
    const guild = await client.guilds.fetch(Guild_ID);
    const member = await guild.members.fetch(userId);
    const channel = client.channels.cache.get(process.env.mention_channel);
    channel.send(`Protection System detected \n<@${member.user.id}> Case insensetive`)
    // console.log(`${userId} Kicked`)
    member.kick();
  } else { // if user exists, ban them
    const guild = await client.guilds.fetch(Guild_ID);
    const member = await guild.members.fetch(userId);
    const channel = client.channels.cache.get(process.env.mention_channel);
    channel.send(`<@${userId}> user Rejoined with the same name, or tried bypass the system`)
    member.ban();
  }
}

// Define the samename function
async function samename() {
  let res = await guild.members.fetch();
  const users = await user_model.find({ Guild_ID: Guild_ID });
  const usernames = users.map(user => user.username);
  const substrings = usernames.map(str => str.split('#')[0]);
  const discriminator = usernames.map(str => str.split('#')[1]);
  const lowerSubstrings = substrings.map(substring => substring.toLowerCase());
  const unicodes = unicode(substrings);


  res.forEach((member) => {
    const users = []
    users.push(member.user.username)
    const detected = detectedNames(users,unicodes)

   if (lowerSubstrings.includes(member.user.username.toLowerCase()) && !discriminator.includes(member.user.discriminator)){
    const channel = client.channels.cache.get(process.env.mention_channel);
    // channel.send(`Protection System detected \n<@${member.user.id}> Case insensetive`)
   
      member.send("Protection system detected that you have Same Or similar name As Protected names. This is put in place to prevent our comunnity from scamers, please change your username, If you do not do so you will be banned ")
      .catch(error =>channel.send("Could not warn user, DM's Closerd"))
    handleUser(member.user.id)
   }

    if (detected == true){
      const channel = client.channels.cache.get(process.env.mention_channel);
      // channel.send(`Protection System detected \n<@${member.user.id}> Tried to bypass protection using unicodes`) 
      
        member.send("Protection system detected that you have Same Or similar name As Protected names. This is put in place to prevent our comunnity from scamers, please change your username, If you do not do so you will be banned ")
        .catch(error =>channel.send(``))
      handleUser(member.user.id)

   }
  });
}

// Execute the samename function at regular intervals
Check_interval = setInterval(async () => {
   samename();
}, interval);


})
client.login(process.env.TOKEN);