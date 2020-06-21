const Discord = require('discord.js');
const humanizeDuration = require('humanize-duration');
const { botOwner } = require('../config.json');
const { version } = require('../package.json');

module.exports = {
	name: 'info',
	description: 'Displays information about the bot.',
	aliases: ['information'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	async execute(message) {
		const developer = await message.client.users.cache.get(botOwner);

		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setThumbnail(message.client.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setTitle(`${message.client.user.username} Information`)
			.addFields(
				{ name: 'Developer:', value: `${developer.tag} (${developer.id})` },
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