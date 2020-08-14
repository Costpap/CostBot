import { prefix, botAdmin, botOwner } from '../botconfig';
import { Command } from '../typings/index';
import { Client, Message } from 'discord.js';

export default async (Discord: typeof import('discord.js'), client: Client, message: Message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName: string = args.shift().toLowerCase();

	const command: Command = client.commands.get(commandName)
	|| client.commands.find(cmd => cmd.aliases?.includes(commandName));

	if (!command) return;

	if (command.disabled) {
		return message.channel.send('⚠ This command has been temporarily disabled.');
	}
	if (command.ownerOnly && (!botOwner.includes(message.author.id)
	|| command.adminOnly && (!botAdmin.includes(message.author.id)))) {
		return message.reply('You cannot use this command!');
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.channel.send('❌ I can\'t execute this command inside DMs!');
	}

	if (command.permissions && message.channel.type === 'text'
	&& !message.guild.me.hasPermission(command.permissions, { checkAdmin: true })) {
		return message.channel.send(`❌ Sorry, I need the \`${command.permissions}\` permission(s) in order to execute this command.`);
	}

	if (command.args && !args.length) {
		return message.channel.send(`⚠ You didn't provide any arguments! ${command.usage.length > 0 ? `\n\n🔧 The proper usage would be: \`${prefix}${command.name} ${command.usage}\`` : ""}`);
	}

	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Discord.Collection());
	}

	const now: number = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount: number = (command.cooldown ?? 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft: number = (expirationTime - now) / 1000;
			const sentMessage: Message = await message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using \`${command.name}\` again.`);
			return sentMessage.delete({ timeout: 3000 });
		}
	} timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.do(message, client, args, Discord);
	}
	catch (error) {
		console.error(error);
		message.reply(`I encountered an error while trying to execute this command: \n\`\`\`${error.message}\`\`\``);
	}
};