const Discord = require('discord.js');

module.exports = {
	name: 'say',
	description: 'Sends a message through the bot',
	adminOnly: true,
	args: true,
	usage: '(#optional-channel) [text]',
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	execute(message, args) {
		message.delete();

		if (!message.mentions.channels.size) {
			if (args[0] === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setColor('#6293f5')
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					.setDescription(args.slice(1).join(' '))
					.setTimestamp();

				return message.channel.send(embed);
			}
			return message.channel.send(args.slice(0).join(' '));
		}

		const sayChannel = message.mentions.channels.first(); {
			if (args[0] === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setColor('#6293f5')
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					.setDescription(args.slice(2).join(' '))
					.setTimestamp();

				return sayChannel.send(embed);
			}
			sayChannel.send(args.slice(1).join(' '));
		}
	},
};