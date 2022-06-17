import { CommandInteraction, MessageEmbed } from 'discord.js';
import { parseDate } from '../utils/misc';

export default {
    name: 'user-info',
    description: 'Displays info about the mentioned user or yourself.',
    options: [
        {
            name: 'user',
            description: 'User to get information on',
            type: 'USER',
        },
        {
            name: 'show_permissions',
            description: "Whether to show the user's permissions",
            type: 'BOOLEAN',
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction) => {
        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        const user = interaction.options?.getUser('user') ?? interaction.user;

        const member = interaction.guild.members.cache.get(user.id);

        const embed = new MessageEmbed()
            .setColor(member.displayHexColor)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ format: 'png', dynamic: true }) })
            .setDescription(`**User mention:** ${member}\n**User ID:** \`${member.id}\``)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .addFields(
                { name: 'Nickname', value: `${member.displayName}`, inline: true },
                {
                    name: 'User Status',
                    value: `${member.presence?.status ?? 'Unable to get presence data'}`,
                    inline: true,
                },
                { name: 'Bot', value: `${member.user.bot ? 'Definitely' : 'Most likely not'}`, inline: true },
                {
                    name: 'Avatar URL',
                    value: `[Click here](${member.user.displayAvatarURL({ format: 'png', dynamic: true })})`,
                    inline: true,
                },
                { name: 'Joined Server', value: `${parseDate(member.joinedAt)}` },
                { name: 'Joined Discord', value: `${parseDate(member.user.createdAt)}`, inline: true },
            )
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
            });

        if (interaction.options?.getBoolean('show_permissions')) {
            embed.addField(
                'Member Permissions',
                `${member.permissions.toArray().join(', ') || "This member doesn't have any permissions"}`,
            );
        }

        interaction.reply({ embeds: [embed] });
    },
};
