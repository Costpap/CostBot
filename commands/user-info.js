const Discord = require('discord.js');

module.exports = {
	name: 'user-info',
	description: 'Display info about the mentioned user or yourself.',
	aliases: ['whois', 'user', 'ui'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	execute(message) {
		const member = message.mentions.members.first() || message.member;
		const embed = new Discord.MessageEmbed()
			.setColor(member.displayHexColor)
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(`User mention: ${member} \n User ID: \`${member.id}\``)
			.setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.addFields(
				{ name: 'Nickname:', value: member.displayName, inline: true },
				{ name: 'User Status:', value: member.presence.status, inline: true },
				{ name: 'Bot:', value: member.user.bot, inline: true },
				{ name: 'Avatar URL:', value: `[Click here](${member.user.displayAvatarURL({ format: 'png', dynamic: true })})`, inline: true },
				{ name: 'Joined Server:', value: member.joinedAt },
				{ name: 'Joined Discord:', value: member.user.createdAt, inline: true },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));

		message.channel.send(embed);
	},
};