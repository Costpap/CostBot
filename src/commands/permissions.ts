import { Message, Client, Role, GuildMember } from 'discord.js';
import { parseMemberMention, parseRoleMention } from '../utils/parse';

export default {
    name: 'permissions',
    description: 'Displays the permissions and roles of the mentioned user or yourself.',
    aliases: ['perms', 'roles', 'permlist', 'rolelist'],
    guildOnly: true,
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, _client: Client, args: string[], Discord: typeof import('discord.js')) => {
        if (args[0] === 'role') {
            const role: Role = parseRoleMention(args[0], message.guild) || message.guild.roles.cache.get(args[0]);
            const embed = new Discord.MessageEmbed()
                .setColor(role.hexColor)
                .setTitle(`Members & permissions list for role **${role.name}**`)
                .addFields(
                    {
                        name: 'Role members:',
                        value:
                            role.members.map((member) => member).join(', ') || 'There are no members with this role.',
                    },
                    {
                        name: 'Role permissions:',
                        value: role.permissions.toArray().join(', ') || "This role doesn't have any permissions.",
                    },
                )
                .setTimestamp(role.createdAt)
                .setFooter(`Role ID: ${role.id}`);

            return message.channel.send(embed);
        }
        let member: GuildMember;
        if (!args[0]) member = message.member;
        else member = parseMemberMention(args[0], message.guild) || message.guild.members.cache.get(args[0]);
        const embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor)
            .setTitle(`Roles & permissions list for ${member.user.tag} (${member.id})`)
            .addFields(
                { name: 'User roles', value: member.roles.cache.map((role) => role).join(', ') },
                {
                    name: 'User permissions',
                    value: member.permissions.toArray().join(', ') || "This user doesn't have any permissions.",
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
