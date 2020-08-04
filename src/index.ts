import { config } from 'dotenv';
config({ path: './.env' });

import { readdirSync } from 'fs';
import * as Discord from 'discord.js';
import { prefix } from './botconfig';

const intents = new Discord.Intents(['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'DIRECT_MESSAGES']);
const client = new Discord.Client({
	ws: { intents: intents },
	presence: { activity: { name: 'Costpap shout', type: 'LISTENING' }, status: 'online' },
	messageCacheLifetime: 300,
	messageSweepInterval: 600,
});

client.events = new Discord.Collection();
const eventFiles = readdirSync('./build/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	import(`./build/events/${file}`)
		.then(({ default: event }) => {
			const eventName: string = file.split(".")[0];

			client.on(eventName as any, (...args) => { // eslint-disable-line @typescript-eslint/no-explicit-any
				try {
					event(Discord, client, ...args);
				}
				catch (error) {
					console.error(error);
				}
			});

			client.events.set(eventName, event);
		});
}
console.log(`Successfully loaded all ${client.events.size} events!`);


client.commands = new Discord.Collection();
const commandFiles = readdirSync('./build/commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	import(`./build/commands/${file}`)
		.then(({ default: command }) => client.commands.set(command.name, command));
}
console.log(`Successfully loaded all ${client.commands.size} commands!`);

client.cooldowns = new Discord.Collection();

if (!process.env.TOKEN) {
	console.error('Missing client token. Shutting down...');
	process.exit(1);
}
if (!prefix || prefix.length > 5) {
	console.error('Prefix is either missing or too long. Shutting down...');
	process.exit(1);
}

process.on('exit', () => {
	console.log('Destroying discord.js Client...');
	client.destroy();
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error)),


client.login(process.env.TOKEN);