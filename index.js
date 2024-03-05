const Discord = require('discord.js');
const Events = require('discord.js');
const {token} = require('./config.json');
const fs = require('node:fs');
const readLastLine = require('read-last-line');

const prefix = '!';
//"201727741819748352"
//"465638983418904586"
let userID = "201727741819748352";


const client = new Discord.Client({
    allowedMentions: {
        parse: [`users`, `roles`],
        repliedUser: true, 
    },
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMembers",
        "GuildVoiceStates",
    ]
});

client.on("ready", () => {
    console.log("Bot is online!")
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // check for bot
    if (oldState.member.user.bot) return;

    // When user joins VC, grab the current time and write it to a file
    if(oldState.channel === null && newState.channel !== null && newState.member.user.id == userID) {
        console.log("join");

        // Get current hour, minute, and seconds
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes();
        let seconds = date.getSeconds();
        let time = JSON.stringify(date.getTime(date));

        // Write the time to the file
        fs.writeFile('time.txt', time, err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log("current time written");
            }
        });
        
    }

    // If user leaves vc, grab the current time, and calculate how long they were in vc
    if(newState.channel === null && oldState.channel !== null && oldState.member.user.id == userID) {
        console.log("dc");
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes();
        let seconds = date.getSeconds();
        let newTime = date.getTime(date);
        let oldTime;

        fs.readFile('time.txt', 'utf8',(err, data) => {
            if (err) {
                console.error(err);
            }
            oldTime = JSON.parse(data);

            // Calculate total time
            //let newTimeArr = newTime.split(",");
            //let oldTimeArr = oldTime.split(",");
            let timeInVC = `${(newTime - oldTime) / 1000} seconds`;
            let joinDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} EST`;
            console.log(`Total time spent in VC: ${timeInVC}`);

            let timeData = `\n${joinDate},${timeInVC}`;

            fs.writeFile('timeData.csv',timeData, {flag: 'a'}, err => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log("Time data written");
                }
            });
        });

    }

})

client.on("messageCreate", (message) => {
    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;

    if (message.mentions.has(client.user.id)) {
        readLastLine.read('timeData.csv',1).then(function(lines) {
            message.channel.send(lines);
        });
    }
});

client.login(token);