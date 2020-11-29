const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const fileName = './birthdays.json';

client.login(process.env.BOT_TOKEN)
    .then(main, main)
    .catch(console.error);

function main() {
    client.on('ready', () => {
        console.log(`Logged in as $(client.user.tag)!`);
    })

    client.on('ready', () => {
        client.user.setActivity('for your birthday :\)', {type: 'WATCHING'})
    })

    client.on('message', msg => {
        let arg1, datesplit;

        if(msg.author.bot)
            return;
        else if (msg.content.startsWith('b!birthday'))
            arg1 = msg.content.split(' ')[1];
            // regex magic to let us check if the arg matches mm/dd/yyyy roughly
            if(arg1.match(/\d{1,2}\/\d{1,2}\/\d{4}/g)) {
                datesplit = arg1.split('/');
                if (parseInt(datesplit[0]) > 12 || parseInt(datesplit[1]) > 31 || (parseInt(datesplit[2]) > parseInt(new Date().getFullYear())))
                    msg.channel.send('Something is wrong with the format of your date. Please try again! (bounds)');
                else {
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
