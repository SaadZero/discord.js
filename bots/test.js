require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = getCommands('./commands')

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}


client.on(Events.InteractionCreate, interaction => {


    if(!interaction.isChatInputCommand()) return;
    
    let command = client.commands.get(interaction.commandName);

    try {
        if(interaction.replied) return;
        command.execute(interaction);
    } catch (err) {
        console.error(err)
    }
})

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

function getCommands(dir) {
    let commands = new Collection();
    const commandsFiles = getFiles(dir);

    for(const commandFile of commandsFiles) {
        const command = require(commandFile);
        commands.set(command.data.toJSON().name, command);
    }
    return commands
}

function getFiles(dir) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });
    let commandFiles = [];

    for (const file of files) {
        if(file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`)
            ]
        } else if(file.name.endsWith('.js')) {
            commandFiles.push(`${dir}/${file.name}`)
        }
    }
    return commandFiles;
};