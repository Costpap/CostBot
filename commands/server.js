const Discord = require('discord.js');

module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	aliases: ['server-info', 'si', 'guild', 'guild-info', 'gi'],
	guildOnly: true,
	cooldown: 5,
	do: (message) => {
		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`${message.guild.name}`)
			.addFields(
				{ name: 'Server Owner:', value: `${message.guild.owner} (${message.guild.ownerID})` },
				{ name: 'Server Region:', value: message.guild.region, inline: true },
				{ name: 'Total Channels:', value: message.guild.channels.cache.size, inline: true },
				{ name: 'Server Members:', value: message.guild.memberCount, inline: true },
				{ name: `Server Roles (${message.guild.roles.cache.size}):`, value: message.guild.roles.cache.map(role => role).join(', ') },
			)
			.setTimestamp(message.guild.createdAt)
			.setFooter(`Server ID: ${message.guild.id}`);

		message.channel.send(embed);
	},
};