module.exports = {
	name: 'permissions',
	description: 'Displays the permissions and roles of the mentioned user or yourself.',
	aliases: ['perms', 'roles', 'permlist', 'rolelist'],
	guildOnly: true,
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message, args, client, Discord) => {
		if (args[0] === 'role') {
			const role = message.guild.roles.cache.get(args[1]);
			const embed = new Discord.MessageEmbed()
				.setColor(role.hexColor)
				.setTitle(`Members & permissions list for role **${role.name}**`)
				.addFields(
					{ name: 'Role members:', value: role.members.map(member => member).join(', ') },
					{ name: 'Role permissions:', value: role.permissions.toArray(permission => permission).join(', ') },
				)
				.setTimestamp(role.createdAt)
				.setFooter(`Role ID: ${role.id}`);

			return message.channel.send(embed);
		}
		const member = message.mentions.members.first() || message.member;
		const embed = new Discord.MessageEmbed()
			.setColor(member.displayHexColor)
			.setTitle(`Roles & permissions list for ${member.user.tag} (${member.id})`)
			.addFields(
				{ name: 'User roles', value: member.roles.cache.map(role => role).join(', ') },
				{ name: 'User permissions', value: member.permissions.toArray(permission => permission).join(', ') },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));

		message.channel.send(embed);
	},
};