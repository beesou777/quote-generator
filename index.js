const axios = require('axios');
const ULR = "https://favqs.com/api/qotd"
const { Client, GatewayIntentBits } = require('discord.js');

const clients = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    ws: { properties: { '$browser': 'discord.js' } } // this help to solve the network issue
});


let quote;

async function generateQuote() {
    try {
        const res = await axios.get(ULR)
        if (res.status === 200) {
            quote = res.data.quote.body
        }
    } catch (error) {
        console.log(error)
    }
}

clients.login(process.env.APIKEY).catch((err) => {
    console.error('Failed to log in:', err);
});

clients.once("ready", async (bot) => {
    console.log(`Logged in as ${bot.user.tag}!`);
    await generateQuote();

    const channel = clients.channels.cache.get("1279091593743437908");
    // console.log(quote)
    if (channel && quote) {
        await channel.send("```Daily Quote: \n" + quote + "```");
        console.log('Quote sent successfully.');
        process.exit(0); 
    } else {
        console.log("Channel not found or quote not generated.");
        process.exit(1); 
    }
});
