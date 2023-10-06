// Get bot token
require('dotenv').config()

// Get discord.js stuff
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')

// Database Connection
const { connectToDatabase } = require('./db')

const fs = require('node:fs')
const path = require('node:path')

const client = new Client({ intents: [GatewayIntentBits.Guilds]})
client.commands = new Collection()

function getCommands() {
    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

// Runs when bot is online
client.once(Events.ClientReady, c => {
    console.log(`Bot ${c.user.tag} is ready.`)
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command called ${interaction.commandName}`)
        return
    }

    try {
        const startTime = Date.now()
        await command.execute(interaction)
        console.log(`Execution time: ${Date.now()-startTime} ms`)
    } catch (error) {
        console.error(error)
    }

})


connectToDatabase()
getCommands()
client.login(process.env.CLIENT_TOKEN)