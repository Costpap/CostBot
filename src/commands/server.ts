import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { parseDate } from '../utils/misc';

export default {
    name: 'server',
    description: 'Displays info about your server.',
    options: [
        {
            name: 'show_roles',
            description: "Whether to show the server's roles",
            type: 'BOOLEAN',
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${interaction.guild.name}`)
            .addFields(
                {
                    name: 'Server Owner',
                    value: `${client.users.cache.get(interaction.guild.ownerId).toString()} (${
                        interaction.guild.ownerId
                    })`,
                },
                { name: 'Server ID', value: `${interaction.guildId}`, inline: true },
                { name: 'Total Channels', value: `${interaction.guild.channels.cache.size}`, inline: true },
                { name: 'Server Members', value: `${interaction.guild.memberCount}`, inline: true },
                {
                    name: 'Server created',
                    value: `${parseDate(interaction.guild.createdAt)}`,
                    inline: true,
                },
            )
            .setTimestamp()
            .setFooter(
                `Requested by ${interaction.user.tag}`,
                interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
            );

        if (interaction.options?.getBoolean('show_roles')) {
            embed.addField(
                `Server Roles (${interaction.guild.roles.cache.size})`,
                `${interaction.guild.roles.cache
                    .map((role) => role)
                    .join(', ')
                    .substring(0, 1017)}`,
            );
        }
        /* This checks whether or not the guild has a server icon or not
        and if true sets it as the embed thumbnail. */
        if (interaction.guild.iconURL) {
            embed.setThumbnail(interaction.guild.iconURL({ format: 'png', dynamic: true }));
        }

        interaction.reply({ embeds: [embed] });
    },
};
