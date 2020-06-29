module.exports = {
	name: 'say',
	description: 'Sends a message through the bot',
	adminOnly: true,
	args: true,
	usage: '(#optional-channel) [text]',
	permissions: ['MANAGE_MESSAGES', 'EMBED_LINKS'],
	cooldown: 5,
	do: async (message, client, args, Discord) => {
		message.delete();

		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setTimestamp();

		if (!message.mentions.channels.size && (args[0] === 'embed')) {
			embed.setDescription(args.slice(1).join(' '));
			return message.channel.send(embed);
		}
		else if (!message.mentions.channels.size) {
			return message.channel.send(args.slice(0).join(' '));
		}

		const sayChannel = message.mentions.channels.first(); {
			if (args[0] === 'embed') {
				embed.setDescription(args.slice(2).join(' '));
				try {
					sayChannel.send(embed);
					const sentMessage = await message.channel.send(`✅ Sucessfully sent message to ${sayChannel}!`);
					return sentMessage.delete({ timeout: 3000 });
				}
				catch (error) {
					console.error(`Could not send a message to ${sayChannel}: \n`, error);
					return message.channel.send(`❌ Could not send message to ${sayChannel}.`);
				}
			}
			try {
				sayChannel.send(args.slice(1).join(' '));
				const sentMessage = await message.channel.send(`✅ Sucessfully sent message to ${sayChannel}!`);
				return sentMessage.delete({ timeout: 3000 });
			}
			catch (error) {
				console.error(`Could not send a message to ${sayChannel}: \n`, error);
				return message.channel.send(`❌ Could not send message to ${sayChannel}.`);
			}
		}
	},
};