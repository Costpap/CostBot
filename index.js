require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, botAdmin, botOwner } = require('./config.json');

const intents = new Discord.Intents(['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'DIRECT_MESSAGES']);
const client = new Discord.Client({
	ws: { intents: intents },
	presence: { activity: { name: 'Costpap shout', type: 'LISTENING' }, status: 'online' },
});
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(`Successfully loaded all ${client.commands.size} commands!`)

if (!process.env.TOKEN) return console.error('Missing client token. Shutting down...');
if (!prefix || prefix.length > 5) return console.error('Prefix is either missing or too long. Shutting down...');

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error)),

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.disabled === true) {
		return message.channel.send(':warning: This command has been temporarily disabled.');
	}
	if (command.ownerOnly && (botOwner.includes(message.author.id) !== true)) {
		return message.reply('You cannot use this command!');
	}

	if (command.adminOnly && (botAdmin.includes(message.author.id) !== true)) {
		return message.reply('You cannot use this command!');
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply(':x: I can\'t execute this command inside DMs!');
	}
	if (command.args && !args.length) {
		let reply = `:warning: You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}


	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
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