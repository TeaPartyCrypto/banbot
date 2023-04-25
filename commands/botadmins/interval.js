const interval_model = require('../../models/interval');
const decodeTime = require('../../utils/time');
const {PermissionsBitField} = require('discord.js')

module.exports = {
  name: "interval",
  permission:PermissionsBitField.Flags.SendMessages,
  description: 'Chose interval for checks',
  options:[{
    name:'time',
    description:'use time formats, like 30s,1m,1h ',
    type: 3,
    required:true,
  }],

  async execute(interaction) {
    const timeString = interaction.options.get('time').value;
    const guildId = interaction.guild.id;

    const timeRegex = /^[1-9]\d*[smh]$/;
    if (!timeRegex.test(timeString)) {
      return interaction.reply('Incorrect time format. Please provide a time in the format of number + time (e.g. 10m).');
    }

    const timeInMillis = decodeTime(timeString);

    let existingInterval = await interval_model.findOne({ Guild_ID: guildId });
    if (existingInterval) {
      // If interval already exists, update the time
      existingInterval.Time = timeInMillis;

      try {
        await existingInterval.save();
        interaction.reply(`Interval has been updated to ${timeString} (${timeInMillis} ms).`);
      } catch (err) {
        console.error(err);
        interaction.reply('Error updating interval.');
      }
    } else {
      const newInterval = new interval_model({
        Guild_ID: guildId,
        Time: timeInMillis,
      });

      try {
        await newInterval.save();
        interaction.reply(`Interval has been set to ${timeString} (${timeInMillis} ms).`);
      } catch (err) {
        console.error(err);
        interaction.reply('Error setting interval.');
      }
    }
  }
}
