import { Message, Client, Role } from 'discord.js';

export default {
	name: 'role-info',
	description: 'Displays information about a role.',
	aliases: ['roleinfo', 'role', 'ri'],
	args: true,
	guildOnly: true,
	usage: '[role ID or mention]',
	permissions: ['EMBED_LINKS'],
	cooldown: 7,
	do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
		const role: Role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		if (!role) {
			return message.channel.send('that doesn\'t seem to be a valid role.');
		}
		const embed = new Discord.MessageEmbed()
			.setColor(role.hexColor)
			.setTitle(`**Role name:** ${role.name}`)
			.setDescription(`**Role mention:** ${role}`)
			.addFields(
				{ name: 'Role position', value: role.position, inline: true },
				{ name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
				{ name: 'Mentionable', value: role.mentionable ? 'Mentionable by everyone' : 'Only with permission', inline: true },
				{ name: 'Hex Color', value: role.hexColor, inline: true },
				{ name: 'Role members', value: role.members.map(member => member).join(', ') },
			)
			.setTimestamp(role.createdAt)
			.setFooter(`Role ID: ${role.id}`);

		message.channel.send(embed);
	},
};