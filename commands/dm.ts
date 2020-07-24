import { Message, Client, User } from 'discord.js';

export default {
	name: 'dm',
	description: 'Sends a direct message through the bot',
	adminOnly: true,
	args: true,
	usage: '@user text',
	permissions: ['MANAGE_MESSAGES'],
	cooldown: 5,
	do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to send them a DM!');
		}
		const dmUser: User = message.mentions.users.first(); {
			if (dmUser.bot) return message.reply('You cannot send messages to this user!');
			message.delete();

			const embed = new Discord.MessageEmbed().setColor('#6293f5').setTimestamp();

			if (args[0] === 'embed' && args[1] === 'name') {
				embed.setDescription(args.slice(3).join(' '));
				embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
				try {
					dmUser.send(embed);
					const sentMessage = await message.channel.send(`✅ Successfully sent DM to **${dmUser.tag}**!`);
					return sentMessage.delete({ timeout: 5000 });
				}
				catch (error) {
					console.error(`Could not send ${message.author.tag}'s (${message.author.id}) DM to ${dmUser.tag} (${dmUser.id}):\n`, error);
					return message.channel.send(`❌ Could not send message to ${dmUser.tag}`);
				}
			}
			else if (args[0] === 'embed') {
				embed.setDescription(args.slice(2).join(' '));
				try {
					dmUser.send(embed);
					const sentMessage = await message.channel.send(`✅ Successfully sent DM to **${dmUser.tag}**!`);
					return sentMessage.delete({ timeout: 5000 });
				}
				catch (error) {
					console.error(`Could not send ${message.author.tag}'s (${message.author.id}) DM to ${dmUser.tag} (${dmUser.id}):\n`, error);
					return message.channel.send(`❌ Could not send message to **${dmUser.tag}**.`);
				}
			}

		}

		try {
			dmUser.send(args.slice(1).join(' '));
			const sentMessage = await message.channel.send(`✅ Successfully sent DM to **${dmUser.tag}**!`);
			return sentMessage.delete({ timeout: 5000 });
		}
		catch (error) {
			console.error(`Could not send ${message.author.tag}'s (${message.author.id}) DM to ${dmUser.tag} (${dmUser.id}):\n`, error);
			return message.channel.send(`❌ Could not send message to **${dmUser.tag}**.`);
		}
	},
};