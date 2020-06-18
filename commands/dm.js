const Discord = require('discord.js');

module.exports = {
	name: 'dm',
	description: 'Sends a direct message through the bot',
	adminOnly: true,
	args: true,
	usage: 'userID text',
	cooldown: 5,
	async execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to send them a DM!');
		}
		const dmUser = message.mentions.users.first(); {
			if (dmUser.bot) return message.reply('You cannot send messages to this user!');
			message.delete();


			if (args[0] === 'embed') {
				const embed = new Discord.MessageEmbed()
					.setColor('#6293f5')
					.setDescription(args.slice(2).join(' '))
					.setTimestamp();
				if (args[1] === 'name') {
					embed.setDescription(args.slice(3).join(' '));
					embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
					try {
						dmUser.send(embed);
						const sentMessage = await message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
						sentMessage.delete({ timeout: 5000 });
					}
					catch (error) {
						console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
						return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
					}
				}

				try {
					dmUser.send(embed);
					const sentMessage = await message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
					return sentMessage.delete({ timeout: 5000 });
				}
				catch (error) {
					console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
					return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
				}
			}

			try {
				dmUser.send(args.slice(1).join(' '));
				const sentMessage = await message.channel.send(`:white_check_mark: Successfully sent DM to ${dmUser.tag}`);
				return sentMessage.delete({ timeout: 5000 });
			}
			catch (error) {
				console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
				return message.channel.send(`:x: Could not send a message to ${dmUser.tag}`);
			}
		}
	},
};