const Discord = require('discord.js');

module.exports = {
	name: 'permissions',
	description: 'Displays the permissions and roles of the mentioned user.',
	aliases: ['perms', 'roles', 'permlist', 'rolelist'],
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		const member = message.mentions.members.first() || message.member;
		const embed = new Discord.MessageEmbed()
			.setColor(member.displayHexColor)
			.setTitle(`Roles & permissions list for ${member.user.tag} (${member.id})`)
			.addFields(
				{ name: 'User roles:', value: member.roles.cache.map(role => role).join(', ') },
				{ name: 'User permissions:', value: `\`\`\`${member.permissions.toArray(permissions => permissions).join(', ')}\`\`\`` },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

		message.channel.send(embed);
	},
};