const Discord = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs');
const client = new Discord.Client();
const fileName = './birthdays.json';

client.login(process.env.BOT_TOKEN)
    .then(main, main)
    .catch(console.error);

// load up json(?) birthdays upon launch from file, create events for each of them here

// example of a new birthday event below - December 13th, each year at noon (wildcard is to allow it on any day of the week)
// probably need to move this into the b!birthday command + startup loop eventually

var j = schedule.scheduleJob(new Date('0 12 13 12 *', function(){
  console.log('announced <user>\'s birthday');
  // send message in channel (maybe create a new channel w/ perms excluding the person?) saying that it's @user's birthday here
});

function main() {
    client.on('ready', () => {
        console.log(`Logged in as $(client.user.tag)!`);
    })

    // not working for whatever reason, god knows why - check if this is deprecated now maybe
    client.on('ready', () => {
        client.user.setActivity('for your birthday :\)', {type: 'WATCHING'})
    })

    client.on('message', msg => {
        let arg1, datesplit;

        if(msg.author.bot)
            return;
        else if (msg.content.startsWith('b!birthday'))
            arg1 = msg.content.split(' ')[1];
            // regex magic to let us check if the arg matches mm/dd/yyyy roughly (possibly not necessary anymore with cron format/Date class- check if it verifies.
            // just a thought- should probably add verification to make sure that you can't have multiple birthdays + a method to remove them eventually (but need to figure out json first)
            if(arg1.match(/\d{1,2}\/\d{1,2}\/\d{4}/g)) {
                datesplit = arg1.split('/');
                if (parseInt(datesplit[0]) > 12 || parseInt(datesplit[1]) > 31 || (parseInt(datesplit[2]) > parseInt(new Date().getFullYear())))
                    msg.channel.send('Something is wrong with the format of your date. Please try again! (bounds)');
                else {
                    // I have absolutely zero clue how to properly store JSONs, we'll see how I can sort this out
                    fs.readFile(fileName, function (err, data) {
                        let json = JSON.parse(data);
                        json.push(`\"$(msg.author.id)\": \"arg1\"`);
                        fs.writeFile(fileName, JSON.stringify(json))
                    });
                    msg.channel.send('Success! Added your birthday.');
                }
            }
            else
                msg.channel.send('Something is wrong with the format of your date. Please try again! (regex)');
    })
}
