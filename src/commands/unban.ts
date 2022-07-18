import {
    ChatInputCommandInteraction,
    Client,
    DiscordAPIError,
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
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Ban Members` permission in order to use this command!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'How do you unban yourself? 🤔', ephemeral: true });
        }
        if (user.id === client.user.id) {
            return interaction.reply({
                content: 'If I was banned, would you be seeing this message? 🤔',
                ephemeral: true,
            });
        }
        try {
            await interaction.guild.members.unban(
                user,
                interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
            );
            interaction.reply({ content: `✅ Unbanned \`${user.tag} (${user.id})\`.`, ephemeral: true });
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownBan) {
                return interaction.reply({
                    content: '❌ This user is not currently banned.',
                    ephemeral: true,
                });
            }

            console.error(error);
            return interaction.reply({
                content: `❌ I encountered an error while trying to unban \`${user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
