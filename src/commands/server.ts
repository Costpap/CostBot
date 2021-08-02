import { Message, MessageEmbed } from 'discord.js';
import { parseDate } from '../utils/parse';

export default {
    name: 'server',
    description: 'Display info about this server.',
    aliases: ['server-info', 'si', 'guild', 'guild-info', 'gi'],
    guildOnly: true,
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message) => {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${message.guild.name}`)
            .addFields(
                { name: 'Server Owner', value: `${message.guild.owner} (${message.guild.ownerID})` },
                { name: 'Server ID', value: message.guild.id, inline: true },
                { name: 'Server Region', value: message.guild.region, inline: true },
                { name: 'Total Channels', value: message.guild.channels.cache.size, inline: true },
                { name: 'Server Members', value: message.guild.memberCount, inline: true },
                {
                    name: 'Server created',
                    value: parseDate(message.guild.createdAt),
                    inline: true,
                },
                {
                    name: `Server Roles (${message.guild.roles.cache.size})`,
                    value: message.guild.roles.cache
                        .map((role) => role)
                        .join(', ')
                        .substring(0, 1017),
                },
            )
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            );
        /* This checks whether or not the guild has a server icon or not
        and if true sets it as the embed thumbnail. */
        if (message.guild.iconURL) {
            embed.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }));
        }

        message.channel.send(embed);
    },
};
