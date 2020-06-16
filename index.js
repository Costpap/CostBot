require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');

const intents = new Discord.Intents(['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'DIRECT_MESSAGES']);
const client = new Discord.Client({
	ws: { intents: intents },
	presence: { activity: { name: 'Costpap shout', type: 'LISTENING' }, status: 'online' },
});


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const events = [];

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	const eventName = file.split(".")[0];

	client.on(eventName, (...args) => {
		try {
			event(Discord, client, ...args);
		}
		catch (error) {
			// console.error(error);
		}
	});
	events.push(eventName);
}
console.log(`Successfully loaded all ${events.length} events!`);


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(`Successfully loaded all ${client.commands.size} commands!`);


if (!process.env.TOKEN) return console.error('Missing client token. Shutting down...');
if (!prefix || prefix.length > 5) return console.error('Prefix is either missing or too long. Shutting down...');

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error)),

client.login(process.env.TOKEN);