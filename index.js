const Discord = require('discord.js');
const fs = require('node:fs');

const prefix = '!';
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
        let time = JSON.stringify(`${hour},${min},${seconds}`);

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
        let newTime = `${hour},${min},${seconds}`;
        let oldTime;

        fs.readFile('time.txt', 'utf8',(err, data) => {
            if (err) {
                console.error(err);
            }
            oldTime = JSON.parse(data);

            // Calculate total time
            let newTimeArr = newTime.split(",");
            let oldTimeArr = oldTime.split(",");
            let timeInVC = `${newTimeArr[0] - oldTimeArr[0]}:${newTimeArr[1] - oldTimeArr[1]}:${newTimeArr[2] - oldTimeArr[2]}`;
            console.log(`Total time spent in VC: ${timeInVC}`);

            let timeData = `${date},${timeInVC}\n`;

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

client.login("MTIwODkyMjQ1NDkzNjkxMTkwMg.GpXZm1.Yl5emEt76xsrxkawI30MtQUBC9Kl35Buk0n8fw");