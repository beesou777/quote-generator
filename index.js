require("dotenv").config();
const axios = require('axios');
const ULR = "https://api.quotable.io/random"
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000


let quote;


app.get('/', (req, res) => {
    res.send(quote);
});


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


const clients = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

clients.on("ready", () => {
    clients.application.commands.create({
        name: "quote",
        description: "Get a random quote",
    })
});

clients.login(process.env.APIKEY).catch((err) => {
    console.error('Failed to log in:', err);
});


setInterval(generateQuote, 1000);

// clients.on('messageCreate', (msg) => {
//     try {
//         console.log(msg)
//         let splitMessage = msg.content.split(" ")[0]
//         if (splitMessage.trim() === 'quote') {
//             msg.reply(quote);
//         }
//     } catch (error) {
//         console.log(error)
//     }
// });
clients.on("interactionCreate",async(msg)=>{
    try {
        if(!msg.isCommand()) return
        if(msg && msg.commandName === "quotes") return await msg.reply(quote);
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT,()=>{
    console.log('listening on port 3000')
});