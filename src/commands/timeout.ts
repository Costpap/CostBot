//Template: https://github.com/Costpap/CostBot/blob/main/src/commands/kick.ts

//imports
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Manages the timeout of the mentioned user.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Times out a user.')
                .addUserOption((option) => option.setName('user').setDescription('User to time out').setRequired(true))
                .addIntegerOption(
                    (
                        option, //TODO: There are fixed times for this, so this should be a choice?
                    ) =>
                        option
                            .setName('duration')
                            .setDescription('Duration of the timeout (in minutes)')
                            .setRequired(true),
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('Reason for timing out the user').setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Removes the timeout of a user.')
                .addUserOption((option) =>
                    option.setName('user').setDescription('User to remove the timeout of').setRequired(true),
                ),
        ),
    run: async (interaction: ChatInputCommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Moderate Members` in order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Moderate Members` permission in order to use this command!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: '❌ You need to specify a valid user to time out!', ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "Aww, please don't time out yourself! 💖", ephemeral: true });
        }

        if (member.permissions.has('Administrator') || member.id === interaction.guild.ownerId) {
            //Permission check for Admins and server owners - they cannot be timed out
            return interaction.reply({
                content: '❌ I cannot time out this user! \n**Admins and the server owner cannot be timed out.**',
                ephemeral: true,
            });
        }

        if (interaction.options.getSubcommand() === 'add') {
            const response = `⏳ Timed out \`${member.user.tag} (${member.id})\`.`;

            try {
                await member.timeout(
                    interaction.options.getInteger('duration') * 60 * 1000,
                    interaction.options.getString('reason'),
                );
                interaction.reply({ content: response, ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: `❌ I encountered an error while trying to time out \`${member.user.tag}\`: \n\`\`\`${
                        error?.message || error
                    }\`\`\``,
                    ephemeral: true,
                });
            }
        }

        if (interaction.options.getSubcommand() === 'remove') {
            const response = `⌛ Timeout of \`${member.user.tag} (${member.id})\` has been removed.`;

            try {
                await member.timeout(null);
                interaction.reply({ content: response, ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: `❌ I encountered an error while trying remove the timeout of \`${
                        member.user.tag
                    }\`: \n\`\`\`${error?.message || error}\`\`\``,
                    ephemeral: true,
                });
            }
        }
    },
};
