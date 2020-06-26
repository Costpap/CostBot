module.exports = {
	name: 'role-info',
	description: 'Displays information about a role.',
	aliases: ['roleinfo', 'role', 'ri'],
	args: true,
	guildOnly: true,
	usage: '[role ID]',
	permissions: ['EMBED_LINKS'],
	cooldown: 7,
	do: async (message, args, Discord) => {
		const role = message.guild.roles.cache.get(args[0]);
		const embed = new Discord.MessageEmbed()
			.setColor(role.hexColor)
			.setTitle(`**Role name:** ${role.name}`)
			.setDescription(`**Role mention:** ${role}`)
			.addFields(
				{ name: 'Role position', value: role.position, inline: true },
				{ name: 'Hoisted', value: role.hoist, inline: true },
				{ name: 'Mentionable', value: role.mentionable, inline: true },
				{ name: 'Hex Color', value: role.hexColor, inline: true },
				{ name: 'Role members', value: role.members.map(member => member).join(', ') },
			)
			.setTimestamp(role.createdAt)
			.setFooter(`Role ID: ${role.id}`);

		message.channel.send(embed);
	},
};