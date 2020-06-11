const Discord = require('discord.js');

module.exports = {
	name: 'dm',
	description: 'Sends a direct message through the bot',
	adminOnly: true,
	args: true,
	usage: 'userID text',
	cooldown: 5,
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to send them a DM!');
		}
		const dmUser = message.mentions.users.first(); {
			if (dmUser.bot) return message.reply('You cannot send messages to this user!');
			message.delete();

			const messageArgs = args.slice(0);
			if (args[0] === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setColor('#6293f5')
					.setDescription(messageArgs.slice(2).join(' '))
					.setTimestamp();
				if (args[1] === 'name') {
					embed.setDescription(messageArgs.slice(3).join(' '));
					embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					try {
						dmUser.send(embed);
						return message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
					}
					catch (error) {
						console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
						return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
					}
				}

				try {
					dmUser.send(embed);
					return message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
				}
				catch (error) {
					console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
					return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
				}
			}

			try {
				dmUser.send(messageArgs.slice(1).join(' '));
				return message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
			}
			catch (error) {
				console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
				return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
			}
		}
	},
};