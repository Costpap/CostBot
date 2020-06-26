const Discord = require('discord.js');
const { version } = require('../package.json');
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'stats',
	description: 'Displays statistics about this bot.',
	aliases: ['statistics', 'uptime'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setTitle(`${message.client.user.username} Statistics`)
			.addFields(
				{ name: 'Server Count', value: message.client.guilds.cache.size, inline: true },
				{ name: 'Total Members', value: message.client.users.cache.size, inline: true },
				{ name: 'Bot uptime', value: humanizeDuration(message.client.uptime), inline: true },
			)
			.setTimestamp()
			.setFooter(`${message.client.user.username} v${version}`, message.client.user.displayAvatarURL({ format: 'png', dynamic: true }));
		message.channel.send(embed);
	},
};