const Discord = require('discord.js');
const { version } = require('../package.json');
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'stats',
	description: 'Displays statistics about this bot.',
	aliases: ['statistics', 'uptime'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message, client) => {
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setTitle(`${client.user.username} Statistics`)
			.addFields(
				{ name: 'Server Count', value: client.guilds.cache.size, inline: true },
				{ name: 'Total Members', value: client.users.cache.size, inline: true },
				{ name: 'Bot uptime', value: humanizeDuration(client.uptime), inline: true },
			)
			.setTimestamp()
			.setFooter(`${client.user.username} v${version}`, client.user.displayAvatarURL({ format: 'png' }));
		message.channel.send(embed);
	},
};