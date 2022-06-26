import { CommandInteraction, NewsChannel, Permissions, TextChannel } from 'discord.js';

export default {
    name: 'prune',
    description: 'Deletes up to 100 messages.',
    options: [
        {
            name: 'amount',
            description: 'Amount of messages to delete',
            type: 'INTEGER',
            required: true,
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction) => {
        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Manage Messages` permission in order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
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
