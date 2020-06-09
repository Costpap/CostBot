import * as Discord from 'discord.js';
import { version } from '../../package.json';
import humanizeDuration from 'humanize-duration';

export default {
	name: 'stats',
	description: 'Shows statistics about this bot.',
	aliases: ['statistics', 'uptime'],
	cooldown: 5,
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setTitle(`${message.client.user.username} Statistics`)
			.addFields(
				{ name: 'Server Count:', value: message.client.guilds.cache.size, inline: true },
				{ name: 'Total Members:', value: message.client.users.cache.size, inline: true },
				{ name: 'Bot uptime:', value: humanizeDuration(message.client.uptime), inline: true },
			)
			.setTimestamp()
			.setFooter(`${message.client.user.username} v${version}`, message.client.user.displayAvatarURL({ dynamic: true }));
		message.channel.send(embed);
	},
};