import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Deletes up to 100 messages.')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount of messages to delete')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Manage Messages` permission in order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '⛔ You need the `Manage Messages` permission in order to use this command!',
                ephemeral: true,
            });
        }
        /** The total number of messages to bulkDelete. */
        const amount: number = interaction.options.getInteger('amount', true);
        /** The channel to delete messages from. This is the channel the command was executed in. */
        const textChannel = interaction.channel;
        try {
            const deletedMessages = await textChannel.bulkDelete(amount, true);
            interaction.reply({
                content: `✅ Pruned **${deletedMessages.size}** ${
                    deletedMessages.size === 1 ? 'message' : 'messages'
                }.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(
                `Error pruning messages in #${textChannel.name} (${textChannel.id}) of ${textChannel.guild.id}:\n`,
                error,
            );
            return interaction.reply({
                content: `❌ I encountered an error while trying to prune messages in this channel: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
