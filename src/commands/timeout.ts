import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import ms from 'ms';
import { notifyUser } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Manages user timeouts.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Times out the selected user.')
                .addUserOption((option) => option.setName('user').setDescription('User to time out').setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('duration')
                        .setDescription('Duration of the timeout (e.g. 10sec/60m/2.5 hrs)')
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('Reason for timing out the user').setRequired(false),
                )
                .addBooleanOption((option) =>
                    option.setName('silent').setDescription('Whether or not to DM the user').setRequired(false),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Removes a timeout for a user.')
                .addUserOption((option) =>
                    option.setName('user').setDescription('User to remove the timeout for').setRequired(true),
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('Reason for removing the timeout').setRequired(false),
                ),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Timeout Members` permission in order to execute this command.',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({
                content: '❌ Unknown permissions. Please try again later.',
                flags: MessageFlags.Ephemeral,
            });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Timeout Members` permission in order to use this command!',
                flags: MessageFlags.Ephemeral,
            });
        }

        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({
                content: '❌ You need to specify a valid user to manage their timeout!',
                flags: MessageFlags.Ephemeral,
            });
        }

        switch (interaction.options.getSubcommand()) {
            default:
            case 'add': {
                if (member.id === interaction.user.id) {
                    return interaction.reply({
                        content: "Aww, please don't time out yourself! 💖",
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (member.moderatable === false) {
                    return interaction.reply({
                        content:
                            '❌ I cannot time out this user! \n**Please make sure that my highest role is above theirs.**',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const duration = interaction.options.getString('duration', true);
                const msDuration = ms(duration);

                if (typeof msDuration !== 'number') {
                    return interaction.reply({
                        content: '❌ Please specify a valid timeout duration.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (msDuration <= 0) {
                    return interaction.reply({
                        content: '❌ The duration of the timeout must be greater than 0!',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (msDuration > 2419200000) {
                    return interaction.reply({
                        content: '❌ The duration of the timeout must be less than or equal to 28 days!',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                let response = `✅ Timed out \`${member.user.tag} (${member.id})\`.`;

                try {
                    await member.timeout(
                        msDuration,
                        interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
                    );
                    if (!interaction.options.getBoolean('silent')) {
                        const notified = await notifyUser(user, interaction, 'timed out');
                        if (!notified) response += "\n\n⚠️ Couldn't send DM to user.";
                    }
                    return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
                } catch (error) {
                    console.error(error);
                    return interaction.reply({
                        content: `❌ I encountered an error while trying to time out \`${member.user.tag}\`: \n\`\`\`${
                            error?.message || error
                        }\`\`\``,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
            case 'remove': {
                if (!member.isCommunicationDisabled()) {
                    return interaction.reply({
                        content: '❌ This user is not currently timed out.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (member.moderatable === false) {
                    return interaction.reply({
                        content:
                            '❌ I cannot remove the timeout for this user! \n**Please make sure that my highest role is above theirs.**',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const response = `✅ Removed the timeout for \`${member.user.tag} (${member.id})\``;

                try {
                    await member.timeout(
                        null,
                        interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
                    );
                    return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
                } catch (error) {
                    console.error(error);
                    return interaction.reply({
                        content: `❌ I encountered an error while trying remove the timeout for \`${
                            member.user.tag
                        }\`: \n\`\`\`${error?.message || error}\`\`\``,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }
    },
};
