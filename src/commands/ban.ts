import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { notifyUser } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans the mentioned user from your server.')
        .addUserOption((option) => option.setName('user').setDescription('User to ban').setRequired(true))
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for banning the user').setRequired(false),
        )
        .addBooleanOption((option) =>
            option.setName('silent').setDescription('Whether or not to DM the user').setRequired(false),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction) => {
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

        const user = interaction.options.getUser('user', true);

        /* This checks if the user to be banned is the person who sent the command,
        and if true, it prevents them from banning themselves. */
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: "Aww, please don't ban yourself! 💖", flags: MessageFlags.Ephemeral });
        }

        let response = `🔨 Banned \`${user.tag} (${user.id})\`.`;

        if (!interaction.options.getBoolean('silent')) {
            const notified = await notifyUser(user, interaction, 'banned');
            if (!notified) response += "\n\n⚠️ Couldn't send DM to user.";
        }

        /* Attempts to ban the user. If the ban is successful,
        the bot will send a message indicating it was successful,
        otherwise an error message will be sent */
        try {
            await interaction.guild.members
                .ban(user, {
                    reason: interaction.options?.getString('reason')
                        ? `${interaction.options?.getString('reason')}`
                        : '',
                })
                .then(async () => {
                    return await interaction.reply({
                        content: response,
                        flags: MessageFlags.Ephemeral,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return interaction.reply({
                        content:
                            '❌ I cannot ban this user! \n**Please make sure that my highest role is above theirs.**',
                        flags: MessageFlags.Ephemeral,
                    });
                });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ I encountered an error while trying to ban \`${user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
