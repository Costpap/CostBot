const Discord = require('discord.js');

module.exports = {
	name: 'dm',
	description: 'Sends a direct message through the bot',
	disabled: true,
	adminOnly: true,
	args: true,
	usage: 'userID text',
	cooldown: 5,
	execute(message, args) {
		message.delete();

		const messageArgs = args.slice(0);
		// eslint-disable-next-line no-unused-vars
		const manyMessageArgs = messageArgs.join(' ');
		// DOES NOT FUNCTION PROPERLY
		if (!message.mentions.channels.size) {
			if (args[0] === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setColor('#6293f5')
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(messageArgs.slice(1).join(' '))
					.setTimestamp();

				return message.channel.send(embed);

			}
			else {message.channel.send(messageArgs.slice(0).join(' '));}
		}

		const sayChannel = message.mentions.channels.first();
		if (args[0] === 'embed') {
			const embed = new Discord.MessageEmbed()
				.setColor('#6293f5')
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(messageArgs.slice(2).join(' '))
				.setTimestamp();

			return sayChannel.send(embed);

		}
		else {sayChannel.send(`${messageArgs.slice(1).join(' ')}`);}
	},
};