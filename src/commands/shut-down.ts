import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { coreLog } from '../utils/logs';

export default {
    data: new SlashCommandBuilder()
        .setName('shut-down')
        .setDescription('Shuts down the bot.')
        .setDefaultMemberPermissions(0),
    internals: {
        privileged: true,
    },
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        coreLog(`🔄 Shutdown initiated by \`${interaction.user.tag} (${interaction.user.id})\`.`, [], client, {
            noWebhook: true,
        });
        console.log(`Shutdown initiated by ${interaction.user.tag} (${interaction.user.id}).`),
            await interaction.reply({ content: '✅ Shutting down...', ephemeral: true });
        process.exit();
    },
};
