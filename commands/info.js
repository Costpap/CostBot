const Discord = require('discord.js');
const humanizeDuration = require('humanize-duration');
const { author, version } = require('../package.json');

module.exports = {
	name: 'info',
	description: 'Sends you information about the bot.',
	aliases: ['information'],
	cooldown: 5,
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setThumbnail(message.client.user.displayAvatarURL({ format: 'png', dynamic: true }))
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