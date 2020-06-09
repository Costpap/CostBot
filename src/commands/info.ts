import { MessageEmbed } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { author, version } from '../../package.json';

export default {
	name: 'info',
	description: 'Sends you information about the bot.',
	aliases: ['information'],
	cooldown: 5,
	execute(message) {
		const embed = new MessageEmbed()
			.setColor('#6293f5')
			.setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
			.setTitle(`${message.client.user.username} Information`)
			.addFields(
				{ name: 'Developer:', value: author },
				{ name: 'Version:', value: version, inline: true },
				{ name: 'Library:', value: 'discord.js', inline: true },
				{ name: 'Server Count:', value: message.client.guilds.cache.size, inline: true },
				{ name: 'Total Members:', value: message.client.users.cache.size, inline: true },
				{ name: 'Uptime:', value: humanizeDuration(message.client.uptime) },
			)
			.setTimestamp();
		message.channel.send(embed);
	},
};