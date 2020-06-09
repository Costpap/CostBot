import { MessageEmbed } from 'discord.js';

export default {
	name: 'dm',
	description: 'Sends a direct message through the bot',
	adminOnly: true,
	args: true,
	usage: 'userID text',
	cooldown: 5,
	execute({ message, args }: { message: any; args: any; }) {
		const dmUser = message.mentions.users.first(); {
			if (dmUser.bot) return message.reply('You cannot send messages to this user!');
			message.delete();

			const messageArgs = args.slice(0);
			if (args[0] === 'embed') {
				const embed = new MessageEmbed()
					.setColor('#6293f5')
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(messageArgs.slice(2).join(' '))
					.setTimestamp();

				return dmUser.send(embed);
			}
			dmUser.send(messageArgs.slice(1).join(' '));}
	},
};