import dotenv from 'dotenv'
dotenv.config();

import { readdirSync } from 'fs';
import { Intents, Client, Collection, Message } from 'discord.js';
import { prefix, botAdmin, botOwner } from '../config.json';

interface Command {
	name: string,
	description: string,
	aliases: string[],
	usage: string,
	cooldown: number,
	execute: (message: Message, args: string[]) => void
}

const intents = new Intents(['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'DIRECT_MESSAGES']);
const client = new Client({
	ws: { intents: intents },
	presence: { activity: { name: 'Costpap shout', type: 'LISTENING' }, status: 'online' },
});

client.commands = new Collection();
const cooldowns = new Collection();

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts'));

const importCommand = async (command: any): Promise<Command> => (await import(`./commands/${command}`) as Command);

for (const file of commandFiles) {
	const command = importCommand(file);
	client.commands.set(command.name, command);
}

if (!process.env.TOKEN) { 
	console.error('Missing client token. Shutting down...');
	process.exit(1);
}
if (!prefix || prefix.length > 5) {
	console.error('Prefix is either missing or too long. Shutting down...');
	process.exit(1);
}

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error)),

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});


client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args: Array<string> = message.content.slice(prefix.length).split(/ +/);
	const commandName: string = args.shift?().toLowerCase();

	const command = client.commands.get(commandName)
	|| client.commands.find((cmd: { aliases: string | string[]; }) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.disabled == true) return message.channel.send(':warning: This command has been temporarily disabled.');
	if (command.adminOnly && (botAdmin.includes(message.author.id) !== true) || (command.ownerOnly && (botOwner.includes(message.author.id) !== true))) return message.reply('You cannot use this command!');
	if (command.guildOnly && message.channel.type !== 'text') return message.reply(':x: I can\'t execute this command inside DMs!');
	if (command.args && !args.length) {
		let reply = `:warning: You didn't provide any arguments, ${message.author}!` 
		if (command.usage) + `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
		return message.channel.send(reply);
	}


	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name) as Collection<any, any>;
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const sentMessage = await message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using \`${command.name}\` again.`);
			return sentMessage.delete({ timeout: 3000 });
		}
	} timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`I encountered an error while trying to execute this command: \n\`\`\`${error.message}\`\`\``);
	}


});

client.login(process.env.TOKEN);
