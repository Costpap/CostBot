import { Client, Message, MessageEmbed, Role } from 'discord.js';
import { parseDate, parseRoleMention } from '../utils/parse';

export default {
    name: 'role-info',
    description: 'Displays information about a role.',
    aliases: ['roleinfo', 'role', 'ri'],
    args: true,
    guildOnly: true,
    usage: '[role ID or mention]',
    permissions: ['EMBED_LINKS'],
    cooldown: 7,
    do: async (message: Message, _client: Client, args: string[]) => {
        const role: Role = parseRoleMention(args[0], message.guild) || message.guild.roles.cache.get(args[0]);
        if (!role) {
            return message.channel.send("❌ That doesn't seem to be a valid role.");
        }
        const embed = new MessageEmbed()
            .setColor(role.hexColor)
            .setTitle(`**Role name:** ${role.name}`)
            .setDescription(`**Role mention:** ${role}\n**Role ID:** \`${role.id}\``)
            .addFields(
                { name: 'Role position', value: role.position, inline: true },
                { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
                {
                    name: 'Mentionable',
                    value: role.mentionable ? 'Mentionable by everyone' : 'Only with permission',
                    inline: true,
                },
                { name: 'Hex color', value: role.hexColor, inline: true },
                {
                    name: 'Role created',
                    value: parseDate(role.createdAt),
                    inline: true,
                },
                {
                    name: 'Role members',
                    value: role.members.map((member) => member).join(', ') || 'There are no members with this role.',
                },
            )
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            );

        message.channel.send(embed);
    },
};
