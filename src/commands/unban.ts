import {
    ChatInputCommandInteraction,
    Client,
    DiscordAPIError,
    MessageFlags,
    PermissionFlagsBits,
    RESTJSONErrorCodes,
    SlashCommandBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a previously banned user from your server.')
        .addUserOption((option) => option.setName('user').setDescription('User to unban').setRequired(true))
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for unbanning the user').setRequired(false),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Ban Members` permission in order to execute this command.',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({
                content: '❌ Unknown permissions. Please try again later.',
                flags: MessageFlags.Ephemeral,
            });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Ban Members` permission in order to use this command!',
                flags: MessageFlags.Ephemeral,
            });
        }

        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'How do you unban yourself? 🤔', flags: MessageFlags.Ephemeral });
        }
        if (user.id === client.user.id) {
            return interaction.reply({
                content: 'If I was banned, would you be seeing this message? 🤔',
                flags: MessageFlags.Ephemeral,
            });
        }
        try {
            await interaction.guild.members.unban(
                user,
                interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
            );
            interaction.reply({ content: `✅ Unbanned \`${user.tag} (${user.id})\`.`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownBan) {
                return interaction.reply({
                    content: '❌ This user is not currently banned.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            console.error(error);
            return interaction.reply({
                content: `❌ I encountered an error while trying to unban \`${user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
