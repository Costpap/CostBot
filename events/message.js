const Discord = require('discord.js');
const { prefix, botAdmin, botOwner } = require('../config.json');

const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.ownerOnly && (botOwner.includes(message.author.id) !== true)) {
		return message.reply('You cannot use this command!');
	}

	if (command.adminOnly && (botAdmin.includes(message.author.id) !== true)) {
		return message.reply('You cannot use this command!');
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply(':x: I can\'t execute that command inside DMs!');
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
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before using \`${command.name}\` again.`);
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


};