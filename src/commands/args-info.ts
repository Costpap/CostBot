import { Message, Client } from 'discord.js';

export default {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	aliases: ['argsinfo'],
	args: true,
	usage: 'argument(s)',
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
		switch (args[0]) {
		case 'foo': {
			message.channel.send('bar');
			break;
		}
		case 'eri': {
			message.channel.send('eri');
			break;
		}
		case 'Dom': {
			message.channel.send('dommy');
		}
			break;
		case 'suspense': {
			message.channel.send('spense');
		}
			break;
		case 'Costpap': {
			message.channel.send('God');
		}
			break;
		default: {
			const embed = new Discord.MessageEmbed()
				.setColor('#6293f5')
				.addFields(
					{ name: 'Arguments', value: args.join(' ') },
					{ name: 'Total length', value: args.length },
				)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
			message.channel.send(embed);
			break;
		}
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.addFields(
				{ name: 'Arguments', value: args.join(' ') },
				{ name: 'Total length', value: args.length },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
		message.channel.send(embed);
	},
};