const humanizeDuration = require('humanize-duration');
const { botOwner } = require('../config.json');
const { version } = require('../package.json');

module.exports = {
	name: 'info',
	description: 'Displays information about the bot.',
	aliases: ['information'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message, client, args, Discord) => {
		const developer = await client.users.cache.get(botOwner);

		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setTitle(`${client.user.username} Information`)
			.addFields(
				{ name: 'Developer', value: `${developer.tag} (${developer.id})` },
				{ name: 'Version', value: version, inline: true },
				{ name: 'Library', value: 'discord.js', inline: true },
				{ name: 'Number of commands', value: client.commands.size, inline: true },
				{ name: 'Server Count', value: client.guilds.cache.size, inline: true },
				{ name: 'Total Members', value: client.users.cache.size, inline: true },
				{ name: 'Uptime', value: humanizeDuration(client.uptime) },
			)
			.setTimestamp();
		message.channel.send(embed);
	},
};