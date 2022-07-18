import {
    ChatInputCommandInteraction,
    NewsChannel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Deletes up to 100 messages.')
        .addIntegerOption((option) =>
            option.setName('amount').setDescription('Amount of messages to delete').setRequired(true),
        ),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
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
        /**
         * The total number of messages to bulkDelete.
         */
        const amount: number = interaction.options.getInteger('amount', true);

        if (amount <= 1 || amount > 100) {
            return interaction.reply({ content: '❌ You need to input a number between 1 and 100.', ephemeral: true });
        }

        const textChannel = interaction.channel as TextChannel | NewsChannel;
        try {
            const deletedMessages = await textChannel.bulkDelete(amount, true);
            interaction.reply({ content: `✅ Pruned **${deletedMessages.size}** messages.`, ephemeral: true });
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
