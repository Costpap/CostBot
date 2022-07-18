import { ChatInputCommandInteraction, Client } from 'discord.js';
import { coreLog } from '../utils/logs';

export default {
    name: 'shut-down',
    description: 'Shuts down the bot.',
    defaultPermission: false,
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        coreLog(`🔄 Shutdown initiated by \`${interaction.user.tag} (${interaction.user.id})\`.`, [], client, {
            noWebhook: true,
        });
        console.log(`Shutdown initiated by ${interaction.user.tag} (${interaction.user.id}).`),
            await interaction.reply({ content: '✅ Shutting down...', ephemeral: true });
        process.exit();
    },
};
