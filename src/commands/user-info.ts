import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { parseDate } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays info about the mentioned user or yourself.')
        .addUserOption((option) =>
            option.setName('user').setDescription('User to get information on').setRequired(false),
        )
        .addBooleanOption((option) =>
            option
                .setName('show_permissions')
                .setDescription("Whether to show the user's permissions")
                .setRequired(false),
        ),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        const user = interaction.options?.getUser('user') ?? interaction.user;

        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setColor(member.displayHexColor)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ extension: 'png', forceStatic: false }) })
            .setDescription(`**User mention:** ${member}\n**User ID:** \`${member.id}\``)
            .setThumbnail(member.user.displayAvatarURL({ extension: 'png', forceStatic: false }))
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
                    value: `[Click here](${member.user.displayAvatarURL({ extension: 'png', forceStatic: false })})`,
                    inline: true,
                },
                { name: 'Joined Server', value: `${parseDate(member.joinedAt)}` },
                { name: 'Joined Discord', value: `${parseDate(member.user.createdAt)}`, inline: true },
            )
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png', forceStatic: false }),
            });

        if (interaction.options?.getBoolean('show_permissions')) {
            embed.addFields([
                {
                    name: 'Member Permissions',
                    value: `${member.permissions.toArray().join(', ') || "This member doesn't have any permissions"}`,
                },
            ]);
        }

        interaction.reply({ embeds: [embed] });
    },
};
