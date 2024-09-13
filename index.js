const axios = require('axios');
const ULR = "https://api.quotable.io/random"
const { Client, GatewayIntentBits } = require('discord.js');

const clients = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let quote;

async function generateQuote() {
    try {
        const res = await axios.get(ULR)
        if (res.status === 200) {
            quote = res.data.content
        }
    } catch (error) {
        console.log(error)
    }
}

clients.login(process.env.APIKEY).catch((err) => {
    console.error('Failed to log in:', err);
});


clients.once("ready", async(bot) => {
    console.log(`Logged in as ${bot.user.tag}!`);
    setTimeout(() => {
        console.log('Stopping the script after 10 seconds');
        process.exit(1);
    }, 10000);
    await generateQuote();
    const channel = clients.channels.cache.get("1279091593743437908");
   if (channel && quote) {
            channel.send("```"+"Daily Quote: \n"+quote + "```");
    } else {
        console.log("channel not found")
    }
});  
